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

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="*" element={<NotFoundPage />} />
	
				<Route path="/" element={<HomePage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/products/:id" element={<ProductDetailPage />} />

				<Route path="/login" element={<LoginPage />} />
				<Route path="/user" element={<LoginSettingsPage />} />
				<Route path="/signUp" element={<SignUpPage />} />
				<Route path="/cart" element={<CartPage />} />
			</Routes>
		</Router>
	)
}

export default App
