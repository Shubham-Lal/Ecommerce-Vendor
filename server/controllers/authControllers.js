const cloudinary = require('cloudinary').v2
const formidable = require("formidable")
const bcrpty = require('bcrypt')
const adminModel = require('../models/adminModel')
const sellerModel = require('../models/sellerModel')
const sellerCustomerModel = require('../models/chat/sellerCustomerModel')
const { createToken } = require('../utiles/tokenCreate')
const { responseReturn } = require('../utiles/response')


class authControllers {

    admin_login = async (req, res) => {
        const { email, password } = req.body

        try {
            const admin = await adminModel.findOne({ email }).select('+password')
            if (admin) {
                const match = await bcrpty.compare(password, admin.password)
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    })

                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })

                    responseReturn(res, 200, { token, message: "Admin logged in" })
                }
                else {
                    responseReturn(res, 404, { error: "Incorrect password" })
                }
            }
            else {
                responseReturn(res, 404, { error: "Admin not Found" })
            }
        }
        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_login = async (req, res) => {
        const { email, password } = req.body

        try {
            const seller = await sellerModel.findOne({ email }).select('+password')
            if (seller) {
                const match = await bcrpty.compare(password, seller.password)
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    })

                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })

                    responseReturn(res, 200, { token, message: "Seller logged in" })
                }
                else {
                    responseReturn(res, 404, { error: "Incorrect password" })
                }
            }
            else {
                responseReturn(res, 404, { error: "Seller not Found" })
            }
        }
        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_register = async (req, res) => {
        const { email, name, password } = req.body

        try {
            const getUser = await sellerModel.findOne({ email })
            if (getUser) {
                responseReturn(res, 404, { error: 'Seller already registered' })
            }
            else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrpty.hash(password, 10),
                    method: 'manually',
                    shopInfo: {}
                })

                await sellerCustomerModel.create({
                    myId: seller.id
                })

                responseReturn(res, 201, { message: 'Seller registered! Login to your account.' })
            }
        }
        catch (error) {
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
    }

    getUser = async (req, res) => {
        const { id, role } = req

        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id)

                responseReturn(res, 200, { userInfo: user })
            }
            else {
                const seller = await sellerModel.findById(id)

                responseReturn(res, 200, { userInfo: seller })
            }
        }
        catch (error) {
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
    }

    profile_image_upload = async (req, res) => {
        const { id } = req
        const form = formidable({ multiples: true })

        form.parse(req, async (err, _, files) => {
            if (err) return responseReturn(res, 500, { error: 'Form parsing error' })

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true
            })

            const { image } = files

            try {
                const userInfo = await sellerModel.findById(id)

                if (userInfo && userInfo.image) {
                    const prevImageUrl = userInfo.image
                    const publicId = prevImageUrl.split('/').pop().split('.')[0]

                    await cloudinary.uploader.destroy(`Ecommerce/Profile/${publicId}`)
                }

                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'Ecommerce/Profile' })
                if (result) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: result.url
                    })

                    const updatedUserInfo = await sellerModel.findById(id)
                    
                    responseReturn(res, 201, { message: 'Profile image uploaded', userInfo: updatedUserInfo })
                }
                else {
                    responseReturn(res, 404, { error: 'Image Upload Failed' })
                }
            } 
            catch (error) {
                responseReturn(res, 500, { error: error.message })
            }
        })
    }

    profile_info_add = async (req, res) => {
        const { division, district, shopName, sub_district } = req.body
        const { id } = req

        try {
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    sub_district
                }
            })

            const userInfo = await sellerModel.findById(id)

            responseReturn(res, 201, { message: 'Profile info updated', userInfo })
        }
        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            })

            responseReturn(res, 200, { message: 'User logged out' })
        }
        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new authControllers()