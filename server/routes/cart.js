const router = require('express').Router()
const { User, Product } = require('../dataModel')
const { authorizeToken } = require('../tokenAuth')

// GET /api/cart/:id
router.get("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }

        const cart = user.cart

        for (const cartProduct of cart) {
            const productData = await Product.findById(cartProduct.productId)
            if (productData != null) {
                cartProduct.product = productData
            }
        }

        res.status(200).json(cart)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// PUT /api/cart/:id (updates contents of the cart)
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

// POST /api/cart/:id/add/:prodId (adds a new product to the cart)
router.post("/:id/add/:prodId", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        if (!req.params.prodId || !req.params.id) {
            res.status(400).send('Missing Product or User ID.')
            return
        }

        let user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }

        let foundProduct = false

        for (const prod of user.cart) {
            if (prod.productId === req.params.prodId) {
                prod.quantity += 1
                foundProduct = true
                break
            }
        }

        if (!foundProduct) {
            user.cart.push({
                productId: req.params.prodId,
                quantity: 1
            })
        }

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