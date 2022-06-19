const { default: mongoose } = require('mongoose')
const { User, Card } = require('../dataModel')
const { authorizeToken } = require('../tokenAuth')

const router = require('express').Router()

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

// POST /api/user/card/:_id
// Updates or creates a card for the user
router.post("/card/:_id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
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