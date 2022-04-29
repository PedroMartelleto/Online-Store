const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { Cart, Product, Order } = require('../dataModel')

router.post("/pay/:cartId", authorizeToken({ adminOnly: false }), async (req, res) => {
    if (!req.body.userId || !req.body.address || !req.body.state || !req.body.zip) {
        res.status(401).send("Missing required fields")
        return
    }

    let cart = null
    try {
        cart = await Cart.findById(req.params.cartId)
    } catch(err) {
        res.status(500).send(err)
        return
    }

    for (const prodInfo of cart.products) {
        const product = Product.findById(prodInfo.productId)
        if (!product) {
            res.status(500).send("Product not found")
            return
        }
        if (product.quantity < prodInfo.quantity) {
            res.status(500).send("One or more products in cart are out of stock")
            return
        }
    }

    // We decrement the quantity of each product in the cart before processing payment, to prevent concurrency problems
    for (const prodInfo of cart.products) {
        const product = Product.findById(prodInfo.productId)
        product.quantity -= prodInfo.quantity
        product.save()
    }

    stripe.charges.create({
        amount: req.body.amount,
        currency: "usd",
        description: "Book Store",
        source: req.body.tokenId
    },
    (err, res) => {
        if (err) {
            // Since the charge failed, we need to increment the quantity of each product in the DB
            for (const prodInfo of cart.products) {
                const product = Product.findById(prodInfo.productId)
                product.quantity += prodInfo.quantity
                product.save()
            }
            res.status(500).json(err)
        }
        else {
            // Creates a new Order
            Order.create({
                userId: req.body.userId,
                products: cart.products.slice(0),
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip
            })

            res.status(200).json(res)
        }
    })
})