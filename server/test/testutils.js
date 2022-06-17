const { User, Product } = require('../dataModel')
const mongoose = require('mongoose')


const init = async () => {
    await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
    await User.deleteMany({})
    await Product.deleteMany({})
}

const clean = async () => {
    if (mongoose.connection.readyState === 1) {
        await User.deleteMany({})
        await Product.deleteMany({})
        await mongoose.connection.close()
    }
}

const verifyDatabaseUser = async (user, checkPasswordDoesntMatch = true) => {
    let userDB = await User.findOne({ email: user.email })
    if (userDB) {
        expect(userDB.firstName).toBe(user.firstName)
        expect(userDB.lastName).toBe(user.lastName)
        expect(userDB.email).toBe(user.email)
        expect(userDB.address).toBe(user.address)
        expect(userDB.city).toBe(user.city)
        expect(userDB.state).toBe(user.state)
        expect(userDB.zip).toBe(user.zip)

        if (checkPasswordDoesntMatch) {
            expect(userDB.password).not.toBe(user.password)
        }
    } else {
        expect(false).toBe(true)
    }
}


const verifyDatabaseProduct = async (product) => {
    let productDB = await Product.findOne({ id: product._id })

    if (productDB) {
        expect(productDB.title).toBe(product.title)
        expect(productDB.author).toBe(product.author)
        expect(productDB.ratingCount).toBe(product.ratingCount)
        expect(productDB.reviewCount).toBe(product.reviewCount)
        expect(productDB.averageRating).toBe(product.averageRating)
        expect(productDB.fiveStarRatings).toBe(product.fiveStarRatings)
        expect(productDB.fourStarRatings).toBe(product.fourStarRatings)
        expect(productDB.threeStarRatings).toBe(product.threeStarRatings)
        expect(productDB.twoStarRatings).toBe(product.twoStarRatings)
        expect(productDB.oneStarRatings).toBe(product.oneStarRatings)
    } else {
        expect(false).toBe(true)
    }
}

const verifyDatabaseCart = async (userId, cart) => {
    let userDB = await User.findOne({ _id: userId })
    expect(userDB.cart.length).toBe(cart.length)
    if (userDB) {
        userDB = userDB.toObject()

        for (let i = 0; i < cart.length; i++) {
            expect(userDB.cart[i].productId.toString()).toBe(cart[i].productId)
            expect(userDB.cart[i].quantity).toBe(cart[i].quantity)
        }
    } else {
        expect(false).toBe(true)
    }
}


module.exports = {
    init, clean, 
    verifyDatabaseUser, verifyDatabaseProduct, verifyDatabaseCart,
}