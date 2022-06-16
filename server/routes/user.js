const { User } = require('../dataModel')
const { authorizeToken } = require('../tokenAuth')

const router = require('express').Router()

// PUT /api/user/:id
router.put("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PWD_SECRET_KEY).toString()
    }

    try {
        let user = await User.findById(req.params.id)
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

// DELETE /api/user/:id
router.delete("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
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

// GET /api/user/:id
router.get("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
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