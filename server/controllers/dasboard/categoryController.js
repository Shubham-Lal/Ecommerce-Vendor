const formidable = require("formidable")
const cloudinary = require('cloudinary').v2
const categoryModel = require('../../models/categoryModel')
const { responseReturn } = require("../../utiles/response")


class categoryController {

    add_category = async (req, res) => {
        const form = formidable()

        form.parse(req, async (err, fields, files) => {
            if (err) responseReturn(res, 404, { error: 'Something went wrong' })
            else {
                let { name } = fields
                let { image } = files
                name = name.trim()
                const slug = name.split(' ').join('-')

                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    secure: true
                })

                try {
                    const result = await cloudinary.uploader.upload(image.filepath, { folder: 'Ecommerce/Category' })

                    if (result) {
                        const category = await categoryModel.create({
                            name,
                            slug,
                            image: result.url
                        })

                        responseReturn(res, 201, { category, message: 'Category added' })
                    }
                    else {
                        responseReturn(res, 404, { error: 'Error uploading image. Try again.' })
                    }
                }
                catch (error) {
                    responseReturn(res, 500, { error: 'Internal Server Error' })
                }
            }
        })
    }

    get_category = async (req, res) => {
        const { page, searchValue, parPage } = req.query

        try {
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }

            if (searchValue && page && parPage) {
                const categories = await categoryModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalCategory = await categoryModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()

                responseReturn(res, 200, { categories, totalCategory })
            }
            else if (searchValue === '' && page && parPage) {
                const categories = await categoryModel.find({}).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalCategory = await categoryModel.find({}).countDocuments()

                responseReturn(res, 200, { categories, totalCategory })
            }
            else {
                const categories = await categoryModel.find({}).sort({ createdAt: -1 })

                const totalCategory = await categoryModel.find({}).countDocuments()

                responseReturn(res, 200, { categories, totalCategory })
            }
        }
        catch (error) { }
    }

    update_category = async (req, res) => {
        const form = formidable()

        form.parse(req, async (err, fields, files) => {
            if (err) return responseReturn(res, 404, { error: 'Something went wrong' })

            let { name } = fields
            let { image } = files
            const { id } = req.params

            name = name.trim()
            const slug = name.split(' ').join('-')

            try {
                const existingCategory = await categoryModel.findById(id)
                if (!existingCategory) {
                    return responseReturn(res, 404, { error: 'Category not found' })
                }

                let result = null
                if (image) {
                    cloudinary.config({
                        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                        api_key: process.env.CLOUDINARY_API_KEY,
                        api_secret: process.env.CLOUDINARY_API_SECRET,
                        secure: true
                    })

                    const prevImageUrl = existingCategory.image
                    if (prevImageUrl) {
                        const publicId = prevImageUrl.split('/').pop().split('.')[0]
                        await cloudinary.uploader.destroy(`Ecommerce/Category/${publicId}`)
                    }

                    result = await cloudinary.uploader.upload(image.filepath, { folder: 'Ecommerce/Category' })
                }

                const updateData = { name, slug }
                if (result) updateData.image = result.url

                const category = await categoryModel.findByIdAndUpdate(id, updateData, { new: true })
                
                responseReturn(res, 200, { category, message: 'Category updated' })
            } 
            catch (error) {
                responseReturn(res, 500, { error: 'Internal Server Error' })
            }
        })
    }

    deleteCategory = async (req, res) => {
        try {
            const categoryId = req.params.id

            const category = await categoryModel.findById(categoryId)
            if (!category) {
                return res.status(404).json({ message: 'Category not found' })
            }

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true
            })

            const imageUrl = category.image
            if (imageUrl) {
                const publicId = imageUrl.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(`Ecommerce/Category/${publicId}`)
            }

            await categoryModel.findByIdAndDelete(categoryId)

            res.status(200).json({ message: 'Category deleted' })
        } 
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}

module.exports = new categoryController()