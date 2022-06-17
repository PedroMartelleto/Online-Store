const axios = require('axios');
const { User, Product } = require('./dataModel')

const register = async (user, admin = false) => {
    let response = await axios.post('http://localhost:8080/api/auth/register', user)
    if (admin) {
        try {
            await User.findOneAndUpdate({ email: user.email }, { isAdmin: true })
        } catch (err) {
            console.warn(err)
        }
    }
    return response
}

const login = async (user) => {
    return await axios.post('http://localhost:8080/api/auth/login', user)
}

const editUser = async (token, id, update) => {
    let uri = 'http://localhost:8080/api/user/' + id
    return await axios.put(uri, update, { headers: { Token: "Bearer " + token } })
}

const deleteUser = async (token, id) => {
    let uri = 'http://localhost:8080/api/user/' + id
    return await axios.delete(uri, { headers: { Token: "Bearer " + token } })
}

const getUser = async (token, id) => {
    let uri = 'http://localhost:8080/api/user/' + id
    return await axios.get(uri, { headers: { Token: "Bearer " + token } })
}

const addProduct = async (token, product) => {
    let uri = 'http://localhost:8080/api/product/'
    return await axios.post(uri, product, { headers: { Token: "Bearer " + token } })
}

const editProduct = async (token, id, update) => {
    let uri = 'http://localhost:8080/api/product/' + id
    return await axios.put(uri, update, { headers: { Token: "Bearer " + token } })
}

const deleteProduct = async (token, id) => {
    let uri = 'http://localhost:8080/api/product/' + id
    return await axios.delete(uri, { headers: { Token: "Bearer " + token } })
}

const getProduct = async (token, id) => {
    let uri = 'http://localhost:8080/api/product/' + id
    return await axios.get(uri, { headers: { Token: "Bearer " + token } })
}

const editCart = async (token, id, update) => {
    let uri = 'http://localhost:8080/api/cart/' + id
    return await axios.put(uri, update, { headers: { Token: "Bearer " + token } })
}

const deleteCart = async (token, id) => {
    let uri = 'http://localhost:8080/api/cart/' + id
    return await axios.delete(uri, { headers: { Token: "Bearer " + token } })
}

const getCart = async (token, id) => {
    let uri = 'http://localhost:8080/api/cart/' + id
    return await axios.get(uri, { headers: { Token: "Bearer " + token } })
}

module.exports = {
    register, login, 
    editUser, deleteUser, getUser, 
    addProduct, editProduct, deleteProduct, getProduct,
    editCart, deleteCart, getCart
}