const { User, Card, Product, Order } = require('../dataModel')
const { authorizeToken } = require('../tokenAuth')

const router = require('express').Router()

// POST /api/user/order/:_id
router.post("/order/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        const user = await User.findById(req.params._id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }

        let cart = user.cart

        if (!cart || cart.length <= 0) {
            res.status(400).send('Cart is empty.')
            return
        }

        cart = cart.filter(item => item.quantity > 0)

        if (cart.length <= 0) {
            res.status(400).send('Cart is empty.')
            return
        }
        
        const paymentInfo = await Card.findById(req.params._id)

        if (paymentInfo == null) {
            res.status(400).send('Payment info not found.')
            return
        }

        const orderInfo = {}
        orderInfo.userId = req.params._id
        orderInfo.products = []
        orderInfo.address = user.address
        orderInfo.city = user.city
        orderInfo.state = user.state
        orderInfo.zip = user.zip

        // Checks that items are in stock
        for (const item of cart) {
            const productAvailable = await Product.findById(item.productId)
            if (productAvailable.quantity < item.quantity) {
                return res.status(400).send('One or more products out of stock.')
            }
            else {
                orderInfo.products.push({ productId: item.productId, quantity: item.quantity })
                productAvailable.quantity -= item.quantity
                await productAvailable.save()
            }
        }

        const order = new Order(orderInfo)
        await order.save()
        
        // Clear the user's cart
        user.cart = []
        await user.save()

        res.status(200).json("Order completed.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// PUT /api/user/:_id/admin/permissions (updates user admin status)
router.put("/:_id/admin/permissions", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        if (req.body.isAdmin == null || req.params._id == null) return res.status(400).send("Missing isAdmin parameter.")

        let user = await User.findById(req.params._id)

        if (user == null) {
            res.status(404).send('User does not exist.')
            return
        }

        user.isAdmin = req.body.isAdmin
        await user.save()

        res.status(200).json("User permissions updated.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// GET /api/user/admin/list
router.get("/admin/list", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        const users = await User.find({})
        const usersList = users.map(user => {
            return {
                _id: user._id,
                email: user.email,
                name: user.firstName + " " + user.lastName,
                isAdmin: user.isAdmin
            }
        })

        res.status(200).json(usersList)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// PUT /api/user/:_id
router.put("/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        let user = await User.findById(req.params._id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }

        Object.assign(user, req.body)
        await user.save()
        res.status(200).json(user)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
const cvvRegex = /^[0-9]{3,4}$/
const cardExpiryRegex = /\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/
const cardHolderRegex = /^[a-zA-Z ]+$/

// POST /api/user/card/:_id
// Updates or creates a card for the user
router.post("/card/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        if (!req.body || !req.body.cardNumber || !req.body.CVC || !req.body.expirationDate || !req.body.cardHolder) {
            res.status(400).send("Missing payment information.")
            return
        }

        if (!req.body.cardNumber.match(cardNumberRegex) || !req.body.CVC.match(cvvRegex)
            || !req.body.expirationDate.match(cardExpiryRegex) || !req.body.cardHolder.match(cardHolderRegex)) {
            res.status(400).send("Invalid payment information.")
            return
        }

        let card = await Card.findById(req.params._id)

        if (card == null) {
            card = Card({
                _id: req.params._id,
                ...req.body
            })
        }
        else {
            Object.assign(card, req.body)
        }

        await card.save()
        res.status(200).json("Sucessfully saved card.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// GET /api/user/card/:_id
// Returns card data for the user
router.get("/card/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        let card = await Card.findById(req.params._id)

        if (card == null) {
            res.status(404).send("Card not found.")
            return
        }

        res.status(200).json(card)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// DELETE /api/user/:_id
router.delete("/:_id", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        let user = await User.findById(req.params._id)
        if (!user) {
            res.status(404).send('User not found.')
            return
        }
        await user.remove()
        res.status(200).json("User deleted.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// GET /api/user/:_id
router.get("/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        const user = await User.findById(req.params._id)

        if (!user) {
            res.status(404).send('User not found.')
            return
        }
        res.status(200).json(user)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

module.exports = router