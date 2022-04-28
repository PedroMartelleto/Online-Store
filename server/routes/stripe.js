const router = require('express').Router()
const stipr = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { Cart } = require('../dataModel')

router.post("/pay/:cartId", async (req, res) => {
    stipr.charges.create({
        amount: req.body.amount,
        currency: "usd",
        description: "Book Store",
        source: req.body.tokenId
    },
    (err, res) => {
        if (err) {
            res.status(500).json(err)
        }
        else {
            const cart = await Cart.findById(req.params.cartId)
            // TODO: This is where we would decrement the inventory
            res.status(200).json(res)
        }
    })
})