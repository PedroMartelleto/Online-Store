import React from "react"
import './App.scss'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ProductDetailPage from './productDetail/productDetailPage'
import NotFoundPage from './notFound/notFoundPage'
import HomePage from './products/homePage'
import ProductsPage from './products/productsPage'
import LoginPage from './auth/loginPage'
import LoginSettingsPage from './auth/loginSettingsPage'
import SignUpPage from './auth/signUpPage'
import CartPage from "./cart/cartPage"
import ManageUsers from "./manageUsers"
import PrivateRoute from "./common/privateRoute"

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="*" element={<NotFoundPage />} />
	
				<Route path="/" element={<HomePage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/products/:id" element={<ProductDetailPage />} />
				
				<Route path="/user/manageUsers" element={<ManageUsers />} />

				<Route path="/login" element={<LoginPage />} />
				<Route path="/signUp" element={<SignUpPage />} />
			
				<Route path="/user" element={<PrivateRoute Component={LoginSettingsPage} />} />
				<Route path="/cart" element={<PrivateRoute Component={CartPage} />} />
			</Routes>
		</Router>
	)
}

export default App
