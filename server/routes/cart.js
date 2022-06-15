const router = require('express').Router()
const { User } = require('../dataModel')
const { authorizeToken } = require('../tokenAuth')

// http://localhost:5008/api/cart/

// GET /api/cart/:id
router.get("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }
        let cart = user.cart
        res.status(200).json(cart)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// POST /api/cart/:id (adds or updates contents of the cart)
router.put("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }
        user.cart = req.body
        await user.save()
        res.status(201).json(user.cart)
    } catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// DELETE /api/cart/:id
router.delete("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }
        user.cart = []
        await user.save()   
        res.status(200).json("Cart deleted.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

module.exports = router