const { User } = require('../dataModel')

const router = require('express').Router()
const jwt = require('jsonwebtoken')

const CryptoJS = require('crypto-js')
const { default: mongoose } = require('mongoose')

// Register
router.post('/register', async (req, res) => {
    try {
        // Creates a new user if everything is valid
        // changes the password to a hash
        
        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

        if (req.body.email && !emailRegex.test(req.body.email)) {
            res.status(400).send('Invalid email')
            return
        }

        if (req.body.phoneNumber && req.body.phoneNumber.match(/[a-z]/i)) {
            res.status(400).send('Invalid phone number')
            return
        }

        if (req.body.zipCode && req.body.zipCode.match(/[a-z]/i)) {
            res.status(400).send('Invalid zip code')
            return
        }

        const userObj = {
            _id: mongoose.Types.ObjectId().toString(),
            ...req.body
        }

        userObj.password = CryptoJS.AES.encrypt(userObj.password, process.env.PWD_SECRET_KEY).toString()
        userObj.isAdmin = false
        userObj._id = mongoose.Types.ObjectId().toString()

        const newUser = new User(userObj)
        newUser._id = mongoose.Types.ObjectId().toString()
        newUser.cart = []
        const savedUser = await newUser.save()
        const { password, ...userWithoutPassword } = savedUser.toObject()

        const accessToken = jwt.sign({
            id: savedUser._id, isAdmin: savedUser.isAdmin
        }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' })

        res.status(201).json({
            ...userWithoutPassword, accessToken
        })
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