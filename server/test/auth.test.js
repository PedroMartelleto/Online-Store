const { User } = require('../dataModel')
const testutils = require('./testutils')
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

const emptyUser = {
    firstName: "", lastName: "", email: "", password: "", address: "", city: "",
    state: "", zip: "", phoneNumber: ""
}

beforeEach(testutils.init)
afterEach(testutils.clean)

test("user creation", async () => {    

    // Checks that both users are created succesfully
    let user1Response = await api.register(user1)
    expect(user1Response.status).toBe(201)
    testutils.verifyDatabaseUser(user1)

    let user2Response = await api.register(user2)
    expect(user2Response.status).toBe(201)
    testutils.verifyDatabaseUser(user2)

    // Checks that the emails match the expected values
    expect(user1Response.data.email).toBe("email1@email.com")
    expect(user2Response.data.email).toBe("email2@email.com")

    // Checks that the passwords were salted and encrypted
    expect(user1Response.data.password === user2Response.data.password).toBe(false)

})

test("repeated user creation", async () => {

    // Creates an user
    await api.register(user1)
    testutils.verifyDatabaseUser(user1)

    // Tries to create an user with the same email (must cause a server side error)
    try {
        await api.register(user1)
    } catch (err) {
        expect(err.response.status).toBe(500)
    }
    
    // checks that the database contains only one user
    let numberOfUsers = await User.countDocuments()
    expect(numberOfUsers).toBe(1)


})

test("empty user creation", async () => {

    // Checks that the user is not created if there are missing fields
    try {
        await api.register(emptyUser)
    } catch (err) {
        expect(err.response.status).toBe(500)
    }

    // Checks that the database is empty
    let numberOfUsers = await User.countDocuments()
    expect(numberOfUsers).toBe(0)

})

test("valid login", async () => {

    // Creates an user
    await api.register(user1)
    testutils.verifyDatabaseUser(user1)

    // Tries to login with the correct credentials
    let loginResponse = await api.login(user1)
    expect(loginResponse.status).toBe(200)
    testutils.verifyDatabaseUser(loginResponse.data)

    // Checks that the returned object contains a token
    expect(loginResponse.data.accessToken).toBeDefined()

})

test("invalid login", async () => {

    // Creates an user
    await api.register(user1)
    testutils.verifyDatabaseUser(user1)

    // Tries to login with the wrong credentials
    try{
        await api.login({ "email": user1.email, "password": "wrong password" })
    } catch (err) {
        expect(err.response.status).toBe(401)
    }
    
})