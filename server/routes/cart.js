const router = require('express').Router()
const { User, Product } = require('../dataModel')
const { authorizeToken } = require('../tokenAuth')

// GET /api/cart/summary/:_id
router.get("/:_id/summary", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        const user = await User.findById(req.params._id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }

        res.status(200).json(user.cart)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// GET /api/cart/:_id
router.get("/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        const user = await User.findById(req.params._id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }

        const cart = Object.assign({}, user.toObject()).cart.slice(0)

        for (const cartProduct of cart) {
            const productData = await Product.findById(String(cartProduct.productId).trim())
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

// PUT /api/cart/:_id (updates contents of the cart)
router.put("/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        let user = await User.findById(req.params._id)
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

// POST /api/cart/:_id/add/:prodId (adds a new product to the cart)
router.post("/:_id/add/:prodId", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        if (!req.params.prodId || !req.params._id) {
            res.status(400).send('Missing Product or User ID.')
            return
        }

        let user = await User.findById(req.params._id)
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

// DELETE /api/cart/:_id/remove/:prodId (removes a product from the cart)
router.delete("/:_id/remove/:prodId", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        if (!req.params.prodId || !req.params._id) {
            res.status(400).send('Missing Product or User ID.')
            return
        }

        let user = await User.findById(req.params._id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }

        let prodIndex = -1

        for (let i = 0; i < user.cart.length; ++i) {
            if (user.cart[i].productId === req.params.prodId) {
                prodIndex = i
                break
            }
        }

        if (prodIndex >= 0) {
            user.cart.splice(prodIndex, 1)
            await user.save()
            res.status(201).json(user.cart)
        }
        else {
            res.status(200).json(user.cart)
        }
    } catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// DELETE /api/cart/:_id (deletes the entire cart)
router.delete("/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        let user = await User.findById(req.params._id)
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