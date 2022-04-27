const router = require('express').Router()
const stipr = require('stripe')(process.env.STRIPE_SECRET_KEY)

// TODO: Decrement quantity of product in inventory
router.post("/payment", async (req, res) => {
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
            res.status(200).json(res)
        }
    })
})