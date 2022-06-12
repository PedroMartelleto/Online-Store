const router = require('express').Router()
const { authorizeToken } = require('../tokenAuth')

// http://localhost:5008/api/cart/

// GET /api/cart/:id
router.get("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id)
        res.status(200).json(cart)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// POST /api/cart/:id (adds or updates contents of the cart)
router.post("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        await Cart.findByIdAndUpdate(req.params.id, req.body, {
            $merge: req.body
        }, { new: true }) // Returns the updated cart
        res.status(201).json("Successfully updated cart.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// DELETE /api/cart/:id
router.delete("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart deleted.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

module.exports = router