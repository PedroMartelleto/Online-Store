const { User } = require('../dataModel')
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
const updatedUser2 = {
    firstName: "novo", lastName: "segundo", email: "email2@email.com",
    password: "password", address: "address2", city: "city2", state: "state2", zip: "22222-2",
    phoneNumber: "123456789"
}
const update = {firstName:"novo"}

beforeEach(testutils.init)
afterEach(testutils.clean)

test("accessing another user's account as an admin", async () => {

    await api.register(user1, admin = true)
    let user2Id = (await api.register(user2)).data._id

    let token = (await api.login(user1)).data.accessToken
    
    let getResponse = await api.getUser(token, user2Id)
    expect(getResponse.status).toBe(200)
    testutils.verifyDatabaseUser(getResponse.data, checkPasswordDoesntMatch = false)

    let editResponse = await api.editUser(token, user2Id, update)
    expect(editResponse.status).toBe(200)
    testutils.verifyDatabaseUser(updatedUser2)

    let deleteResponse = await api.deleteUser(token, user2Id)
    expect(deleteResponse.status).toBe(200)
    expect(await User.findOne({ email: user2.email })).toBe(null)

})

test ("accessing a non-existent user's account as an admin", async () => {

    await api.register(user1, admin = true)
    let user2Id = "000000000000"

    let token = (await api.login(user1)).data.accessToken
    
    try {
        await api.getUser(token, user2Id)
    } catch (err) {
        expect(err.response.status).toBe(404)
    }
    
    try {
        await api.editUser(token, user2Id, update)
    } catch (err) {
        expect(err.response.status).toBe(404)
    }
    
    try {
        await api.deleteUser(token, user2Id)
    } catch (err) {
        expect(err.response.status).toBe(404)
    }

})


test("accessing another user's account as a non-admin", async () => {

    await api.register(user1)
    let user2Id = (await api.register(user2)).data._id

    let token = (await api.login(user1)).data.accessToken
    
    try {
        let getResponse = await api.getUser(token, user2Id)
    } catch (err) {
        expect(err.response.status).toBe(403)
    }
    
    try {
        let editResponse = await api.editUser(token, user2Id, update)
    } catch (err) {
        expect(err.response.status).toBe(403)
        testutils.verifyDatabaseUser(user2)
    }
    
    try {
        let deleteResponse = await api.deleteUser(token, user2Id)
    } catch (err) {
        expect(err.response.status).toBe(403)
    }

})

test("accessing a user's own account", async () => {
    
    let userId = (await api.register(user2)).data._id
    
    let token = (await api.login(user2)).data.accessToken
    
    let getResponse = await api.getUser(token, userId)
    expect(getResponse.status).toBe(200)
    testutils.verifyDatabaseUser(getResponse.data, checkPasswordDoesntMatch = false)

    let editResponse = await api.editUser(token, userId, update)
    expect(editResponse.status).toBe(200)
    testutils.verifyDatabaseUser(updatedUser2)

    let deleteResponse = await api.deleteUser(token, userId)
    expect(deleteResponse.status).toBe(200)
    expect(await User.findOne({ email: user2.email })).toBe(null)

    
})
