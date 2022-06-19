import { createContext, useEffect, useState } from "react"
import axios from "axios"
import LoadingScreen from "../common/loadingScreen"
import ObjectRenamer from "./objectRenamer"

const ENDPOINT = "http://localhost:3333/api/"//"https://bookstore-intro-web-dev.herokuapp.com/api/"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [ authenticated, setAuthenticated ] = useState(false)
    const [ isWaitingAuth, setIsWaitingAuth ] = useState(true)
    const [ isAdmin, setIsAdmin ] = useState(false)
    const [ authToken, setAuthToken ] = useState(null)
    const [ cartSize, setCartSize ] = useState(0)

    // Callback that handles token authentication
    const handleToken = (token) => {
        Api.defaults.headers.token = `Bearer ${token.accessToken}`
        setAuthenticated(true)
        setIsAdmin(token.isAdmin)
        setAuthToken(token)
    }

    // Authentication callbacks passed down by the Context Provider
    const login = async (loginInfo) => {
        const response = await axios.post(ENDPOINT + "auth/login", ObjectRenamer.toBackend(loginInfo), Api.defaults)

        if (response.status === 201 || response.status === 200) {
            localStorage.setItem('token', JSON.stringify(response.data))
            handleToken(response.data)
        }
        else {
            setAuthenticated(false)
            setIsAdmin(false)
        }
    }

    const register = async (registerInfo) => {
        const response = await axios.post(ENDPOINT + "auth/register", ObjectRenamer.toBackend(registerInfo), Api.defaults)
        
        if (response.status === 200 || response.status === 201) {
            localStorage.setItem('token', JSON.stringify(response.data))
            handleToken(response.data)
        }
        else {
            setAuthenticated(false)
            setIsAdmin(false)
        }
    }

    const logout = async () => {
        localStorage.removeItem('token')
        Api.defaults.headers.token = null
        setAuthenticated(false)
        setIsAdmin(false)
    }

    // Checks for session tokens
    useEffect(() => {
        let tokenString = localStorage.getItem('token')

        if (tokenString != null) {
            handleToken(JSON.parse(tokenString))
        }
        else {
            setIsAdmin(false)
            setAuthenticated(false)
        }

        setIsWaitingAuth(false)
    }, [])

    if (isWaitingAuth) {
        return <LoadingScreen />
    }

    return (
        <AuthContext.Provider value={{ authenticated, login, logout, register, isAdmin, authToken, cartSize, setCartSize }}>
            {children}
        </AuthContext.Provider>
    )
}

const encodeDataToURL = (data) => {
    const url = []

    for (const key of Object.keys(data)) {
        if (data[key] != null) {
            url.push(key + "=" + encodeURIComponent(data[key]))
        }
    }

    return url.join("&")
}

class Api {
    static defaults = {
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true'
        }
    }

    static async getCartSize(userId) {
        const uri = ENDPOINT + "user/cart/size/" + userId
        const response = await axios.get(uri, Api.defaults)
        if (response.status === 200) {
            return response.data
        }
        else {
            return 0
        }
    }

    static async getProductsBatch(genres, limit, skip, minRating, maxRating) {
        limit = limit || 10
        skip = skip || 0

        const queryURL = ENDPOINT + "product?" + encodeDataToURL({ genres, limit, skip, minRating, maxRating })
        const response = await axios.get(queryURL, Api.defaults)

        if (response.status === 200) {
            return response.data
        }
        else {
            return null
        }
    }

    static async getProductsPageCount(genres, sort, limit, sortAsc) {
        limit = limit || 10

        const queryURL = ENDPOINT + "product/pageCount?" + encodeDataToURL({ genres, sort, limit, sortAsc })
        const response = await axios.get(queryURL, Api.defaults)

        if (response.status === 200) {
            return response.data
        }
        else {
            return null
        }
    }

    static async mergeSettings(id, update) {
        const uri = ENDPOINT + "user/" + id
        const response = axios.put(uri, ObjectRenamer.toBackend(update), Api.defaults)

        if (response.status === 200) {
            return response.data
        }
        else {
            console.warn(response)
            return null
        }
    }

    static async mergeCardData(id, update) {
        const uri = ENDPOINT + "user/card/" + id
        const response = await axios.post(uri, ObjectRenamer.toBackend(update), Api.defaults)

        if (response.status === 200) {
            return response.data
        }
        else {
            console.warn(response)
            return null
        }
    }

    static async getCardData(id) {
        const uri = ENDPOINT + "user/card/" + id
        const response = await axios.get(uri, Api.defaults)

        if (response.status === 200) {
            return response.data
        }
        else {
            console.warn(response)
            return null
        }
    }

    static deleteUser(id) {
        const uri = ENDPOINT + "user/" + id
        return axios.delete(uri, Api.defaults)
    }

    static async getUser(id) {
        const uri = ENDPOINT + "user/" + id
        const response = await axios.get(uri, Api.defaults)

        if (response.status === 200) {
            return response.data
        }
        else {
            console.warn(response)
            return null
        }
    }

    static async getProduct(prodId) {
        const uri = ENDPOINT + "product/" + prodId
        try {
            const response = await axios.get(uri, Api.defaults)
            if (response.status === 200) {
                return response.data
            }
            else {
                console.warn(response)
                return null
            }
        }
        catch (err) {
            console.warn(err)
        }

        return null
    }

    static async setCart(userId, update) {
        const uri = ENDPOINT + "cart/" + userId
        const response = await axios.put(uri, update, Api.defaults)

        if (response.status === 200) {
            return response.data
        }
        else {
            console.warn(response)
            return null
        }
    }

    static async addProductToCart(userId, prodId) {
        const uri = ENDPOINT + "cart/" + userId + "/add/" + prodId
        const response = await axios.post(uri, {}, Api.defaults)
        return response.status === 200
    }

    static deleteCart(userId) {
        const uri = ENDPOINT + "cart/" + userId
        return axios.delete(uri, Api.defaults)
    }

    static async getCart(id) {
        const uri = ENDPOINT + "cart/" + id
        const response = await axios.get(uri, Api.defaults)
        
        if (response.status === 200) {
            return response.data
        }
        else {
            console.warn("Failed to get Cart:", response)
            return null
        }
    }

    static adminCreateProduct(productId) {
        const uri = ENDPOINT + "product/"
        const response = axios.post(uri, productId, Api.defaults)
        if (response.status === 200) {
            return response.data
        }
        else {
            console.warn("Failed to add Product to Cart:", response)
            return null
        }
    }

    static adminEditProduct(prodID, update) {
        const uri = ENDPOINT + "product/" + prodID
        return axios.put(uri, update, Api.defaults)
    }

    static adminDeleteProduct(prodID) {
        const uri = ENDPOINT + "product/" + prodID
        return axios.delete(uri, Api.defaults)
    }
}

export { Api as default, AuthContext, AuthProvider }