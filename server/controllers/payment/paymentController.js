const { mongo: { ObjectId } } = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const sellerModel = require('../../models/sellerModel')
const stripeModel = require('../../models/stripeModel')
const sellerWallet = require('../../models/sellerWallet')
const withdrawRequest = require('../../models/withdrawRequest')
const { responseReturn } = require('../../utiles/response')

const stripe = require('stripe')('sk_test_51Oml5cGAwoXiNtjJZbPFBKav0pyrR8GSwzUaLHLhInsyeCa4HI8kKf2IcNeUXc8jc8XVzBJyqjKnDLX9MlRjohrL003UDGPZgQ')


class paymentController {

    create_stripe_connect_account = async (req, res) => {
        const { id } = req
        const uid = uuidv4()

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id })

            if (stripeInfo) {
                await stripeModel.deleteOne({ sellerId: id })
                const account = await stripe.accounts.create({ type: 'express' })

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: `${process.env.ADMIN_URL}/refresh`,
                    return_url: `${process.env.ADMIN_URL}/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })

                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })

                responseReturn(res, 201, { url: accountLink.url })
            }
            else {
                const account = await stripe.accounts.create({ type: 'express' })

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: `${process.env.ADMIN_URL}/refresh`,
                    return_url: `${process.env.ADMIN_URL}/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })

                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })

                responseReturn(res, 201, { url: accountLink.url })
            }
        }
        catch (error) { }
    }

    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params
        const { id } = req

        try {
            const userStripeInfo = await stripeModel.findOne({ code: activeCode })

            if (userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id, {
                    payment: 'active'
                })

                responseReturn(res, 200, { message: 'Stripe account activated' })
            }
            else {
                responseReturn(res, 404, { message: 'Failed activating Stripe account' })
            }
        }
        catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }

    sumAmount = (data) => {
        let sum = 0

        for (let i = 0; i < data.length; i++) {
            sum = sum + data[i].amount;
        }

        return sum
    }

    get_seller_payment_details = async (req, res) => {
        const { sellerId } = req.params

        try {
            const payments = await sellerWallet.find({ sellerId })

            const pendingWithdraws = await withdrawRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    },
                    {
                        status: {
                            $eq: 'pending'
                        }
                    }
                ]
            })

            const successWithdraws = await withdrawRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    },
                    {
                        status: {
                            $eq: 'success'
                        }
                    }
                ]
            })

            const pendingAmount = this.sumAmount(pendingWithdraws)
            const withdrawAmount = this.sumAmount(successWithdraws)
            const totalAmount = this.sumAmount(payments)

            let availableAmount = 0

            if (totalAmount > 0) {
                availableAmount = totalAmount - (pendingAmount + withdrawAmount)
            }

            responseReturn(res, 200, {
                totalAmount,
                pendingAmount,
                withdrawAmount,
                availableAmount,
                pendingWithdraws,
                successWithdraws
            })
        }
        catch (error) { }
    }

    withdrawal_request = async (req, res) => {
        const { amount, sellerId } = req.body

        try {
            const withdrawal = await withdrawRequest.create({
                sellerId,
                amount: parseInt(amount)
            })

            responseReturn(res, 200, { withdrawal, message: 'Payment withdraw request sent' })
        }
        catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }

    get_payment_request = async (req, res) => {
        try {
            const withdrawalRequest = await withdrawRequest.find({ status: 'pending' })

            responseReturn(res, 200, { withdrawalRequest })
        }
        catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }

    payment_request_confirm = async (req, res) => {
        const { paymentId } = req.body

        try {
            const payment = await withdrawRequest.findById(paymentId)

            const { stripeId } = await stripeModel.findOne({
                sellerId: new ObjectId(payment.sellerId)
            })

            await stripe.transfers.create({
                amount: payment.amount * 100,
                currency: 'usd',
                destination: stripeId
            })

            await withdrawRequest.findByIdAndUpdate(paymentId, { status: 'success' })

            responseReturn(res, 200, { payment, message: 'Payment withdraw request confirmed' })
        }
        catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
}

module.exports = new paymentController()