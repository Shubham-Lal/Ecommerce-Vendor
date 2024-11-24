const formidable = require("formidable")
const cloudinary = require('cloudinary').v2
const productModel = require('../../models/productModel')
const { responseReturn } = require("../../utiles/response")


class productController {

    add_product = async (req, res) => {
        const { id } = req
        const form = formidable({ multiples: true })

        form.parse(req, async (err, field, files) => {
            let { name, category, description, stock, price, discount, shopName, brand } = field
            let { images } = files
            name = name.trim()
            const slug = name.split(' ').join('-')

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true
            })

            try {
                let allImageUrl = []

                if (!Array.isArray(images)) {
                    images = [images]
                }

                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(images[i].filepath, { folder: 'Ecommerce/Product' })
                    allImageUrl.push(result.url)
                }

                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    shopName,
                    category: category.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images: allImageUrl,
                    brand: brand.trim()
                })

                responseReturn(res, 201, { message: 'Product Added Successfully' })
            }
            catch (error) {
                responseReturn(res, 500, { error: error.message })
            }
        })
    }

    products_get = async (req, res) => {
        const { page, searchValue, parPage } = req.query
        const { id } = req

        const skipPage = parseInt(parPage) * (parseInt(page) - 1)

        try {
            if (searchValue) {
                const products = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalProduct = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).countDocuments()

                responseReturn(res, 200, { products, totalProduct })
            }
            else {
                const products = await productModel.find({ sellerId: id }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalProduct = await productModel.find({ sellerId: id }).countDocuments()

                responseReturn(res, 200, { products, totalProduct })
            }
        }
        catch (error) { }
    }

    product_get = async (req, res) => {
        const { productId } = req.params

        try {
            const product = await productModel.findById(productId)

            responseReturn(res, 200, { product })
        }
        catch (error) { }
    }

    product_update = async (req, res) => {
        let { name, description, stock, price, discount, brand, productId } = req.body
        name = name.trim()
        const slug = name.split(' ').join('-')

        try {
            await productModel.findByIdAndUpdate(productId, {
                name, description, stock, price, discount, brand, productId, slug
            })
            const product = await productModel.findById(productId)

            responseReturn(res, 200, { product, message: 'Product Updated Successfully' })
        }
        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    product_image_update = async (req, res) => {
        const form = formidable({ multiples: true })

        form.parse(req, async (err, field, files) => {
            const { oldImage, productId } = field
            const { newImage } = files

            if (err) responseReturn(res, 400, { error: err.message })
            else {
                try {
                    cloudinary.config({
                        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                        api_key: process.env.CLOUDINARY_API_KEY,
                        api_secret: process.env.CLOUDINARY_API_SECRET,
                        secure: true
                    })

                    const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'Ecommerce/Product' })

                    if (result) {
                        let { images } = await productModel.findById(productId)
                        const index = images.findIndex(img => img === oldImage)
                        images[index] = result.url
                        await productModel.findByIdAndUpdate(productId, { images })

                        const publicId = oldImage.split('/').pop().split('.')[0]
                        await cloudinary.uploader.destroy(`Ecommerce/Product/${publicId}`)

                        const product = await productModel.findById(productId)
                        responseReturn(res, 200, { product, message: 'Product Image Updated Successfully' })
                    }
                    else {
                        responseReturn(res, 404, { error: 'Image Upload Failed' })
                    }
                }
                catch (error) {
                    responseReturn(res, 404, { error: error.message })
                }
            }
        })
    }
}

module.exports = new productController()