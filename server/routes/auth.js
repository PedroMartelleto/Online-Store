const { User } = require('../models')

const router = require('express').Router()
const jwt = require('jsonwebtoken')

function isValidString(str) {
    return typeof str === 'string' && str.trim().length > 0
}

// Register
router.post('/register', async (req, res) => {
    // Basic request validation
    const b = req.body
    const fieldsThatAreRequired = ['firstName', 'lastName', 'email', 'password', 'address', 'city', 'state', 'zip']
    let missingField = false

    for (const field of fieldsThatAreRequired) {
        if (!isValidString(b[field])) {
            missingField = true
            break
        }
    }

    if (missingField) {
        res.status(400).send('Missing required fields.')
    }

    // Creates a new user if everything is valid
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        // The password is AES encrypted
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PWD_SECRET_KEY).toString(),
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
    })

    try {
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
        }

        // Encrypts the password and compares it to the encrypted password in the database
        const hashedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.PWD_SECRET_KEY).toString()
        
        if (user.password !== hashedPassword) {
            res.status(401).send('Invalid email or password.')
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