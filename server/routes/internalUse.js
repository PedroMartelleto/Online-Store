const router = require('express').Router()
const { User } = require("../dataModel")
const CryptoJS = require('crypto-js')

// POST /api/INTERNAL_USE/createAdmin (adds a new product to the cart)
router.post("/createAdmin", async (req, res) => {
    const newUserJson = {
        firstName: "admin",
        lastName: "null",
        email: "admin@admin.com",
        password: "admin",
        address: "null",
        city: "null",
        state: "null",
        zip: "null",
        phoneNumber: "null",
        isAdmin: true
    }

    newUserJson.password = CryptoJS.AES.encrypt(newUserJson.password, process.env.PWD_SECRET_KEY).toString()

    let newUser = new User(newUserJson)
    newUser.cart = []
    await newUser.save()
    await User.findOneAndUpdate({ email: newUserJson.email }, { isAdmin: true })

    res.status(201).send("Admin created.")
})

module.exports = router