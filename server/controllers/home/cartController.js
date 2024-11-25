const { mongo: { ObjectId } } = require('mongoose')
const cartModel = require('../../models/cartModel')
const wishlistModel = require('../../models/wishlistModel')
const { responseReturn } = require('../../utiles/response')


class cartController {

    add_to_cart = async (req, res) => {
        const { userId, productId, quantity } = req.body

        try {
            const product = await cartModel.findOne({
                $and: [{
                    productId: {
                        $eq: productId
                    }
                },
                {
                    userId: {
                        $eq: userId
                    }
                }
                ]
            })

            if (product) {
                responseReturn(res, 404, { error: "Product already in cart" })
            }
            else {
                const product = await cartModel.create({
                    userId,
                    productId,
                    quantity
                })

                responseReturn(res, 201, { message: "Product added to cart", product })
            }
        }
        catch (error) { }
    }

    get_cart_products = async (req, res) => {
        const co = 5
        const { userId } = req.params

        try {
            const cart_products = await cartModel.aggregate([{
                $match: {
                    userId: {
                        $eq: new ObjectId(userId)
                    }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: "_id",
                    as: 'products'
                }
            }
            ])
            let buy_product_item = 0
            let calculatePrice = 0
            let cart_product_count = 0
            const outOfStockProduct = cart_products.filter(p => p.products[0].stock < p.quantity)
            for (let i = 0; i < outOfStockProduct.length; i++) {
                cart_product_count = cart_product_count + outOfStockProduct[i].quantity
            }
            const stockProduct = cart_products.filter(p => p.products[0].stock >= p.quantity)
            for (let i = 0; i < stockProduct.length; i++) {
                const { quantity } = stockProduct[i]
                cart_product_count = buy_product_item + quantity
                buy_product_item = buy_product_item + quantity
                const { price, discount } = stockProduct[i].products[0]
                if (discount !== 0) {
                    calculatePrice = calculatePrice + quantity * (price - Math.floor((price * discount) / 100))
                }
                else {
                    calculatePrice = calculatePrice + quantity * price
                }
            }
            let p = []
            let unique = [...new Set(stockProduct.map(p => p.products[0].sellerId.toString()))]
            for (let i = 0; i < unique.length; i++) {
                let price = 0
                for (let j = 0; j < stockProduct.length; j++) {
                    const tempProduct = stockProduct[j].products[0]
                    if (unique[i] === tempProduct.sellerId.toString()) {
                        let pri = 0
                        if (tempProduct.discount !== 0) {
                            pri = tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount) / 100)
                        }
                        else {
                            pri = tempProduct.price
                        }
                        pri = pri - Math.floor((pri * co) / 100)
                        price = price + pri * stockProduct[j].quantity
                        p[i] = {
                            sellerId: unique[i],
                            shopName: tempProduct.shopName,
                            price,
                            products: p[i] ? [
                                ...p[i].products,
                                {
                                    _id: stockProduct[j]._id,
                                    quantity: stockProduct[j].quantity,
                                    productInfo: tempProduct
                                }
                            ] : [{
                                _id: stockProduct[j]._id,
                                quantity: stockProduct[j].quantity,
                                productInfo: tempProduct
                            }]
                        }
                    }
                }
            }

            responseReturn(res, 200, {
                cart_products: p,
                price: calculatePrice,
                cart_product_count,
                shipping_fee: 20 * p.length,
                outOfStockProduct,
                buy_product_item
            })
        }
        catch (error) { }
    }

    delete_cart_products = async (req, res) => {
        const { cart_id } = req.params

        try {
            await cartModel.findByIdAndDelete(cart_id)

            responseReturn(res, 200, { message: "Product removed from cart" })
        }
        catch (error) { }
    }

    quantity_inc = async (req, res) => {
        const { cart_id } = req.params

        try {
            const product = await cartModel.findById(cart_id)
            const { quantity } = product
            await cartModel.findByIdAndUpdate(cart_id, { quantity: quantity + 1 })

            responseReturn(res, 200, { message: "Quantity updated" })
        }
        catch (error) { }
    }

    // quantity_dec = async (req, res) => {
    //     const { cart_id } = req.params

    //     try {
    //         const product = await cartModel.findById(cart_id)
    //         const { quantity } = product
    //         await cartModel.findByIdAndUpdate(cart_id, { quantity: quantity - 1 })

    //         responseReturn(res, 200, { message: "Qty Updated" })
    //     }
    //     catch (error) { }
    // }

    quantity_dec = async (req, res) => {
        const { cart_id } = req.params

        try {
            const product = await cartModel.findById(cart_id)

            if (!product) {
                return responseReturn(res, 404, { message: "Product not found" })
            }

            const { quantity } = product

            if (quantity > 1) {
                await cartModel.findByIdAndUpdate(cart_id, { quantity: quantity - 1 })
                return responseReturn(res, 200, { message: "Quantity updated" })
            }
            else {
                return responseReturn(res, 400, { message: "Quantity cannot be less than 1" })
            }
        } catch (error) { }
    }

    add_wishlist = async (req, res) => {
        const { slug } = req.body

        try {
            const product = await wishlistModel.findOne({ slug })
            if (product) {
                responseReturn(res, 404, { error: 'Product already in wishlist' })
            }
            else {
                await wishlistModel.create(req.body)

                responseReturn(res, 201, { message: 'Product added to wishlist' })
            }
        }
        catch (error) { }
    }

    get_wishlist = async (req, res) => {
        const { userId } = req.params

        try {
            const wishlists = await wishlistModel.find({ userId })

            responseReturn(res, 200, {
                wishlistCount: wishlists.length,
                wishlists
            })
        }
        catch (error) { }
    }

    remove_wishlist = async (req, res) => {
        const { wishlistId } = req.params

        try {
            const wishlist = await wishlistModel.findByIdAndDelete(wishlistId)

            responseReturn(res, 200, {
                message: 'Product removed from wishlist',
                wishlistId
            })
        }
        catch (error) { }
    }
}

module.exports = new cartController()