import React, { useContext, useEffect, useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import ProductCard from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
import CategoriesText from "../common/categoriesText"
import NavbarContainer from "../common/navbarContainer"
import StoreButton, { RightArrow } from "../common/storeButton"
import Api, { AuthContext } from "../api"
import Pages from "./pages"
import { ROUTES } from "../App"
import { useSearchParams } from "react-router-dom"
import StarsFilter from "./starsFilter"
import NotFoundPage from "../notFound/notFoundPage"

const cx = classNames.bind(styles)

// MARK: - Main product page
const ProductsPage = props => {
    const [products, setProducts] = useState([])

    const filters = []
    const { isAdmin } = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const [minRating, setMinRating] = useState(searchParams.get('minRating') || 0)
    const [maxRating, setMaxRating] = useState(searchParams.get('maxRating') || 5)

    const sort = searchParams.get('sort') || 'reviewCount'
    const limit = 10
    let page = searchParams.get('page') || 1
    page = Number(page)

    const skip = (page-1) * limit
    const sortAsc = true

    useEffect(() => {
        (async () => {
            const genres = ['Fiction']
            const products = await Api.getProductsBatch(genres, sort, limit, skip, sortAsc, minRating, maxRating)

            if (products) {
                setProducts(products)
            }
        })()
    }, [setProducts, sort, limit, skip, sortAsc, page, minRating, maxRating ])

    if (page > 4 || page <= 0) {
        return <NotFoundPage />
    }

    return (
        <>
            <NavbarContainer />
            <div className={cx("prodCont")}>
                <div className={cx("titleCont")}>
                    <h1>Fiction</h1>
                    {isAdmin ?
                        <StoreButton variant="filled" onMouseDown={event => window.location.href = ROUTES.newProduct} >
                            {"Add a New Book "}<RightArrow color="white" />
                        </StoreButton>
                        : undefined}
                </div>
                {!!filters && filters.length > 0 ? (
                    <div>
                        <h6>Applied filters:</h6>
                    </div>) : undefined}
                <div className={cx("leftMenu")}>
                    <div className={cx("leftMenuLeft")}>
                        <CategoriesText
                            noPadding={true}
                            title="Categories"
                            links={["Fiction", "Psychology", "Science", "Science Fiction"]}
                        />
                        <div className={cx("rating")}>
                            <h4>Rating</h4>
                            <StarsFilter
                                values={[ minRating, maxRating ]}
                                setValues={values => {
                                    setMinRating(values[0])
                                    setMaxRating(values[1])
                                }}
                            />
                            <StoreButton
                                className={{[cx("filterBtn")]: true}}
                                disabled={(minRating === maxRating) || (minRating > maxRating) || (Number(minRating) === Number(searchParams.get('minRating')) && Number(maxRating) === Number(searchParams.get('maxRating')))}
                                variant="outlined"
                                onMouseDown={event => setSearchParams({ minRating, maxRating })}>
                                Filter
                            </StoreButton>
                        </div>
                    </div>
                    <ResponsiveRow classNames={{ [cx("leftAligned")]: true }}>
                        {products.map(prod => (
                            <ProductCard
                                border={true}
                                product={prod}
                                key={prod._id}
                            />
                        ))}
                    </ResponsiveRow>
                </div>
                <Pages setSearchParams={setSearchParams} page={page} />
            </div>
        </>
    )
}

export default ProductsPage