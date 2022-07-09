import React, { createContext, useEffect, useState } from "react"
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
    const [ cartSummary, setCartSummary ] = useState([])

    // Callback that handles token authentication
    const handleToken = (token) => {
        API.defaults.headers.token = `Bearer ${token.accessToken}`
        API.defaults.userId = token._id

        setAuthenticated(true)
        setIsAdmin(token.isAdmin)
        setAuthToken(token)
    }

    // Authentication callbacks passed down by the Context Provider
    const login = async (loginInfo) => {
        try {
            const response = await axios.post(ENDPOINT + "auth/login", ObjectRenamer.toBackend(loginInfo), API.defaults)

            if (response.status === 201 || response.status === 200) {
                localStorage.setItem('token', JSON.stringify(response.data))
                handleToken(response.data)
            }
            else {
                setAuthenticated(false)
                setIsAdmin(false)
                return "Incorrect email or password"
            }
        }
        catch (err) {
            return "Incorrect email or password"
        }
    }

    const register = async (registerInfo) => {
        try {
            const response = await axios.post(ENDPOINT + "auth/register", ObjectRenamer.toBackend(registerInfo), API.defaults)
            
            if (response.status === 200 || response.status === 201) {
                localStorage.setItem('token', JSON.stringify(response.data))
                handleToken(response.data)
            }
            else {
                setAuthenticated(false)
                setIsAdmin(false)
            }
        }
        catch (err) {
            return "Email already in use"
        }
    }

    const logout = async () => {
        localStorage.removeItem('token')
        API.defaults.headers.token = null
        API.defaults.userId = null
        setAuthenticated(false)
        setIsAdmin(false)
    }

    // Checks for session tokens
    useEffect(() => {
        (async () => {
            let tokenString = localStorage.getItem('token')

            if (tokenString != null) {
                const token = JSON.parse(tokenString)
                handleToken(token)
                if (!token.isAdmin) {
                    const cartSummary = await API.getCartSummary()
                    if (cartSummary != null) {
                        setCartSummary(cartSummary)
                    }
                    else {
                        logout()
                    }
                }
            }
            else {
                setIsAdmin(false)
                setAuthenticated(false)
            }

            setIsWaitingAuth(false)
        })()
    }, [])

    if (isWaitingAuth) {
        return <LoadingScreen />
    }

    return (
        <AuthContext.Provider value={{ authenticated, login, logout, register, isAdmin, authToken, cartSummary, setCartSummary }}>
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

function isSuccessStatus(response) {
    return response.status >= 200 && response.status < 300
}

async function backendRequest(path, data, func) {
    try {
        const funcMap = {
            "POST": axios.post,
            "PUT": axios.put,
            "GET": axios.get,
            "DELETE": axios.delete
        }

        const uri = getEndpoint(path)
        let response = null
        
        if (data != null) {
            response = await funcMap[func](uri, data, API.defaults)
        }
        else {
            response = await funcMap[func](uri, API.defaults)
        }

        if (isSuccessStatus(response)) {
            return response.data
        }
        else {
            console.warn(response)
            return null
        }
    }
    catch (err) {
        console.warn(err)
        return null
    }
}

async function POST(path, data) {
    return backendRequest(path, data, "POST")
}

async function PUT(path, data) {
    return backendRequest(path, data, "PUT")
}

async function GET(path) {
    return backendRequest(path, null, "GET")
}

async function DELETE(path) {
    return backendRequest(path, null, "DELETE")
}

function getEndpoint(path) {
    let endpoint = ENDPOINT + path
    if (endpoint.indexOf(':userId') !== -1) {
        endpoint = endpoint.replace(':userId', API.defaults.userId)
    }
    return endpoint
}

class API {
    static defaults = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        }
    }

    static async getProductsBatch(genres, limit, skip, minRating, maxRating, searchTerm) {
        limit = limit || 10
        skip = skip || 0

        const query = { genres, limit, skip, minRating, maxRating }

        if (searchTerm != null && searchTerm.length > 0) {
            query.searchTerm = searchTerm
        }

        const queryURL = "product?" + encodeDataToURL(query)
        return await GET(queryURL)
    }

    static async mergeSettings(update) {
        return await PUT("user/:userId", ObjectRenamer.toBackend(update))
    }

    static async mergeCardData(update) {
        return await POST("user/card/:userId", ObjectRenamer.toBackend(update))
    }

    static async getCardData() {
        return await GET("user/card/:userId")
    }

    static async makeOrder() {
        return await POST("user/order/:userId", {})
    }

    static async deleteUser() {
        return await DELETE("user/:userId")
    }

    static async getUser() {
        return await GET("user/:userId")
    }

    static async getProduct(prodId) {
        return await GET("product/" + prodId)
    }

    static async setCart(update) {
        return await PUT("cart/:userId", update)
    }

    static async addProductToCart(prodId) {
        return await POST("cart/:userId/add/" + prodId, {})
    }

    static async removeProductFromCart(prodId) {
        return await DELETE("cart/:userId/remove/" + prodId)
    }

    static async deleteCart() {
        return await DELETE("cart/:userId")
    }

    static async getCart() {
        return await GET("cart/:userId")
    }

    // Returns cart data without querying any product info besides their IDs
    static async getCartSummary() {
        return await GET("cart/:userId/summary")
    }
}

class AdminAPI {
    static async createProduct(prodData) {
        return await POST("product/new", prodData)
    }

    static async editProduct(prodID, update) {
        return await PUT("product/" + prodID, update)
    }

    static async deleteProduct(prodID) {
        return await DELETE("product/" + prodID)
    }

    static async getUsersList() {
        return await GET("user/admin/list")
    }

    static async toggleAdmin(user) {
        return await PUT("user/" + user._id + "/admin/permissions", {
            isAdmin: !user.isAdmin
        })
    }

    static async deleteUser(userId) {
        return await DELETE("user/" + userId)
    }
}

export { API as default, AdminAPI, AuthContext, AuthProvider }