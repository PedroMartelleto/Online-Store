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
import { PrivateRoute, AdminRoute } from "./common/privateRoute"
import { AuthProvider } from "./api"
import OrderCompletePage from "./orderComplete"

const ROUTES = {
	home: "/",
	products: "/products",
	productDetail: "/products/:_id",
	newProduct: "/products/new",
	login: "/login",
	signUp: "/signUp",
	userSettings: "/user",
	userCart: "/user/cart",
	manageUsers: "/admin/manageUsers",
	orderComplete: "/orderComplete",
}

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="*" element={<NotFoundPage />} />
		
					<Route path={ROUTES.home} element={<HomePage />} />
					<Route path={ROUTES.products} element={<ProductsPage />} />
					<Route path={ROUTES.productDetail} element={<ProductDetailPage />} />
					
					<Route path={ROUTES.manageUsers} element={<AdminRoute><ManageUsers/></AdminRoute>} />

					<Route path={ROUTES.login} element={<LoginPage />} />
					<Route path={ROUTES.signUp} element={<SignUpPage />} />
				
					<Route path={ROUTES.userSettings} element={<PrivateRoute><LoginSettingsPage/></PrivateRoute>} />
					<Route path={ROUTES.userCart} element={<PrivateRoute><CartPage/></PrivateRoute>} />

					<Route path={ROUTES.orderComplete} element={<PrivateRoute><OrderCompletePage/></PrivateRoute>} />
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export { App as default, ROUTES }
