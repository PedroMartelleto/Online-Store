const { User, Product } = require('../dataModel')
const axios = require('axios');
const mongoose = require('mongoose')
let testutils = require('./testutils')
const api = require('../api') 

const user1 = {
    firstName: "usuario", lastName: "primeiro", email: "email1@email.com",
    password: "password", address: "address1", city: "city1", state: "state1", zip: "11111-1",
    phoneNumber: "123456789"
}
const user2 = {
    firstName: "usuario", lastName: "segundo", email: "email2@email.com",
    password: "password", address: "address2", city: "city2", state: "state2", zip: "22222-2",
    phoneNumber: "123456789"
}

const item1 = 
    {
        _id: "7", title: "title", author: "author",
        ratingCount: 1, reviewCount: 1, averageRating: 5, fiveStarRatings: 1, fourStarRatings: 0, threeStarRatings: 0, twoStarRatings: 0, oneStarRatings: 0
    }

const item2 = 
    {
        _id: "9", title: "title", author: "author",
        ratingCount: 1, reviewCount: 1, averageRating: 5, fiveStarRatings: 1, fourStarRatings: 0, threeStarRatings: 0, twoStarRatings: 0, oneStarRatings: 0
    }

beforeEach(testutils.init)  
afterEach(testutils.clean)

test("an user interacting with their own cart", async () => {
    await api.register(user1,admin = true)
    let tokenAdmin = (await api.login(user1)).data.accessToken

    let productId1 = (await api.addProduct(tokenAdmin, item1)).data._id
    let productId2 = (await api.addProduct(tokenAdmin, item2)).data._id
    

    let userId = (await api.register(user2)).data._id
    let token = (await api.login(user2)).data.accessToken

    let cart = [
        { productId: productId1, quantity: 1 },
        { productId: productId2, quantity: 5 }
    ]

    let addResponse = await api.editCart(token, userId, cart)
    expect(addResponse.status).toBe(201)
    testutils.verifyDatabaseCart(userId, cart)

    let getResponse = await api.getCart(token, userId)
    expect(getResponse.status).toBe(200)
    testutils.verifyDatabaseCart(userId, getResponse.data)

    let removeResponse = await api.deleteCart(token, userId, productId1)
    expect(removeResponse.status).toBe(200)
    testutils.verifyDatabaseCart(userId, [])

})

test ("an user interacting with another user's cart", async () => {
    let userId1 = (await api.register(user1, admin=true)).data._id
    let token1 = (await api.login(user1)).data.accessToken

    let userId2 = (await api.register(user2)).data._id
    let token2 = (await api.login(user2)).data.accessToken

    let productId1 = (await api.addProduct(token1, item1)).data._id
    let productId2 = (await api.addProduct(token1, item2)).data._id

    let cart = [
        {productId: productId1, quantity: 1},
        {productId: productId2, quantity: 5}
    ]

    await api.editCart(token1, userId1, cart)
    testutils.verifyDatabaseCart(userId1, cart)

    try {
        await api.getCart(token2, userId1)
    } catch (e) {
        expect(e.response.status).toBe(403)
    }

    try {
        await api.editCart(token2, userId1, cart)
    } catch (e) {
        expect(e.response.status).toBe(403)
    }

    try {
        await api.deleteCart(token2, userId1)
    } catch (e) {
        expect(e.response.status).toBe(403)
    }
})

test("an user inserting an invalid item in the cart", async () => {
    let userId = (await api.register(user2)).data._id
    let token = (await api.login(user2)).data.accessToken

    let cart = [{productId: "999999999999", quantity: 1}]

    try {
        await api.editCart(token, userId, cart)
    } catch (e) {
        expect(e.response.status).toBe(500)
    }
})

test("an admin accessing another user's cart", async () => {
    await api.register(user1, admin=true)
    let userId = (await api.register(user2)).data._id
    let token = (await api.login(user1)).data.accessToken

    let productId1 = (await api.addProduct(token, item1)).data._id
    let productId2 = (await api.addProduct(token, item2)).data._id

    let cart = [
        {productId: productId1, quantity: 1},
        {productId: productId2, quantity: 5}
    ]
    
    let addResponse = await api.editCart(token, userId, cart)
    expect(addResponse.status).toBe(201)
    testutils.verifyDatabaseCart(userId, cart)

    let getResponse = await api.getCart(token, userId)
    expect(getResponse.status).toBe(200)
    testutils.verifyDatabaseCart(userId, getResponse.data)

    let removeResponse = await api.deleteCart(token, userId, productId1)
    expect(removeResponse.status).toBe(200)
    testutils.verifyDatabaseCart(userId, [])

})  
