const { User } = require('../dataModel')
const { authorizeToken } = require('../tokenAuth')

const router = require('express').Router()

// http://localhost:5008/api/user/

// UPDATE /api/user/:id
router.put("/:id", authorizeToken({ adminOnly: false }), async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PWD_SECRET_KEY).toString()
    }

    try {
        const mergedUser = await User.findByIdAndUpdate(req.params.id, req.body, { 
            $merge: req.body
        }, { new: true }) // Returns the updated user
        res.status(200).json(mergedUser)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// DELETE /api/user/:id
router.delete("/:id", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
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
        res.status(200).json(user)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

module.exports = router