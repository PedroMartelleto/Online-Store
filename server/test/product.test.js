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

const product = 
    {
        _id: "1", title: "title", author: "author",
        ratingCount: 1, reviewCount: 1, averageRating: 5, fiveStarRatings: 1, fourStarRatings: 0, threeStarRatings: 0, twoStarRatings: 0, oneStarRatings: 0
    }

const updatedProduct =
    {
        _id: "1", title: "newtitle", author: "author",
    ratingCount: 1, reviewCount: 1, averageRating: 5, fiveStarRatings: 1, fourStarRatings: 0, threeStarRatings: 0, twoStarRatings: 0, oneStarRatings: 0
    }

const update = {title:"newtitle"}

beforeEach(testutils.init)
afterEach(testutils.clean)

test("accessing products as an admin", async () => {

    await api.register(user1,admin = true)
    let token = (await api.login(user1)).data.accessToken

    let addResponse = await api.addProduct(token, product)
    expect(addResponse.status).toBe(201)
    testutils.verifyDatabaseProduct(addResponse.data)
    let productId = addResponse.data._id

    let editResponse = await api.editProduct(token, productId, update)
    expect(editResponse.status).toBe(200)
    testutils.verifyDatabaseProduct(updatedProduct)

    let getResponse = await api.getProduct(token, productId)
    expect(getResponse.status).toBe(200)
    testutils.verifyDatabaseProduct(updatedProduct)

    let deleteResponse = await api.deleteProduct(token, productId)
    expect(deleteResponse.status).toBe(200)
    expect(await Product.findOne({ _id: productId })).toBe(null)

})

test("accessing products as a non-admin user", async () => {
    // Adds an item
    await api.register(user1,admin = true)
    let tokenAdmin = (await api.login(user1)).data.accessToken
    let productId = (await api.addProduct(tokenAdmin, product)).data._id

    await api.register(user2)
    let token = (await api.login(user2)).data.accessToken

    try{
        await api.addProduct(token, product)
    } catch(err) {
        expect(err.response.status).toBe(403)
    }

    try {
        await api.editProduct(token, productId, product)
    } catch(err) {
        expect(err.response.status).toBe(403)
    }

    try{
        await api.deleteProduct(token, productId)
    } catch(err) {
        expect(err.response.status).toBe(403)
    }

    let getResponse = await api.getProduct(token, productId)
    expect(getResponse.status).toBe(200)
    testutils.verifyDatabaseProduct(getResponse.data)

})

test("accessing non-existent products as an admin", async () => {

    await api.register(user1,admin = true)
    let token = (await api.login(user1)).data.accessToken

    let productId = "non-existent-id"

    try{
        await api.getProduct(token, productId)
    } catch(err) {
        expect(err.response.status).toBe(404)
        expect(await Product.findOne({ _id: productId })).toBe(null)
    }

    try{
        await api.editProduct(token, productId, product)
    } catch(err) {
        expect(err.response.status).toBe(404)
        expect(await Product.findOne({ _id: productId })).toBe(null)
    }

    try{
        await api.deleteProduct(token, productId)
    } catch(err) {
        expect(err.response.status).toBe(404)
        expect(await Product.findOne({ _id: productId })).toBe(null)
    }

})    

// TODO: add tests for getting the list of items
