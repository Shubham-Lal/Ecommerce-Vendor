const sellerModel = require('../../models/sellerModel')
const { responseReturn } = require("../../utiles/response")

class sellerController {

    request_seller_get = async (req, res) => {
        const { page, searchValue, parPage } = req.query
        const skipPage = parseInt(parPage) * (parseInt(page) - 1)

        try {
            if (searchValue) { }
            else {
                const sellers = await sellerModel.find({ status: 'pending' }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalSeller = await sellerModel.find({ status: 'pending' }).countDocuments()

                responseReturn(res, 200, { sellers, totalSeller })
            }
        }
        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_seller = async (req, res) => {
        const { sellerId } = req.params

        try {
            const seller = await sellerModel.findById(sellerId)

            responseReturn(res, 200, { seller })
        }
        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_status_update = async (req, res) => {
        const { sellerId, status } = req.body

        try {
            await sellerModel.findByIdAndUpdate(sellerId, { status })
            const seller = await sellerModel.findById(sellerId)

            responseReturn(res, 200, { seller, message: 'Seller status updated' })
        }
        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_active_sellers = async (req, res) => {
        let { page, searchValue, parPage } = req.query
        page = parseInt(page)
        parPage = parseInt(parPage)

        const skipPage = parPage * (page - 1)

        try {
            if (searchValue) {
                const sellers = await sellerModel.find({
                    $text: { $search: searchValue },
                    status: 'active'
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalSeller = await sellerModel.find({
                    $text: { $search: searchValue },
                    status: 'active'
                }).countDocuments()

                responseReturn(res, 200, { totalSeller, sellers })
            }
            else {
                const sellers = await sellerModel.find({
                    status: 'active'
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalSeller = await sellerModel.find({
                    status: 'active'
                }).countDocuments()

                responseReturn(res, 200, { totalSeller, sellers })
            }
        }
        catch (error) { }
    }

    get_deactive_sellers = async (req, res) => {
        let { page, searchValue, parPage } = req.query
        page = parseInt(page)
        parPage = parseInt(parPage)

        const skipPage = parPage * (page - 1)

        try {
            if (searchValue) {
                const sellers = await sellerModel.find({
                    $text: { $search: searchValue },
                    status: 'deactive'
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalSeller = await sellerModel.find({
                    $text: { $search: searchValue },
                    status: 'deactive'
                }).countDocuments()

                responseReturn(res, 200, { totalSeller, sellers })
            }
            else {
                const sellers = await sellerModel.find({
                    status: 'deactive'
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalSeller = await sellerModel.find({
                    status: 'deactive'
                }).countDocuments()

                responseReturn(res, 200, { totalSeller, sellers })
            }
        }
        catch (error) { }
    }
}

module.exports = new sellerController()