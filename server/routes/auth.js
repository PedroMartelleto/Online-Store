const { User } = require('../dataModel')

const router = require('express').Router()
const jwt = require('jsonwebtoken')

const CryptoJS = require('crypto-js')

// Register
router.post('/register', async (req, res) => {
    try {
        // Creates a new user if everything is valid
        // changes the password to a hash

        let userObj = req.body

        userObj.password = CryptoJS.AES.encrypt(userObj.password, process.env.PWD_SECRET_KEY).toString()
        userObj.isAdmin = false

        let newUser = new User(userObj)
        newUser.cart = []
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const user  = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(401).send('Invalid email or password.')
            return
        }

        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PWD_SECRET_KEY).toString(CryptoJS.enc.Utf8)

        if (decryptedPassword !== req.body.password) {
            res.status(401).send('Invalid email or password.')
            return
        }

        const { password, ...userWithoutPassword } = user.toObject()

        const accessToken = jwt.sign({
            id: user._id, isAdmin: user.isAdmin
        }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' })

        res.status(200).json({
            ...userWithoutPassword, accessToken
        })
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

module.exports = router