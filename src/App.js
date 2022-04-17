import './App.scss'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ProductDetailPage from './productDetail/productDetailPage'
import NotFoundPage from './notFound/notFoundPage'
import HomePage from './products/homePage'
import ProductsPage from './products/productsPage'

function App() {
	return (
		<Router>
			<Routes>
				<Route path="*" element={<NotFoundPage />} />
	
				<Route path="/" element={<HomePage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/products/detail/:id" element={<ProductDetailPage />} />
			</Routes>
		</Router>
	);
}

export default App
