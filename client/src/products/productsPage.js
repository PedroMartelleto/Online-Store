import React, { useContext, useEffect, useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import ProductCard from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
import CategoriesText from "../common/categoriesText"
import NavbarContainer from "../common/navbarContainer"
import StoreButton, { RightArrow } from "../common/storeButton"
import API, { AuthContext } from "../api"
import Pages from "./pages"
import { ROUTES } from "../App"
import { useNavigate, useSearchParams } from "react-router-dom"
import StarsFilter from "./starsFilter"
import NotFoundPage from "../notFound/notFoundPage"
import genresSortedByVoteCount from "../genresSortedByVoteCount.json"

const cx = classNames.bind(styles)

// MARK: - Main product page
const ProductsPage = props => {
    const [products, setProducts] = useState([])

    const filters = []
    const { isAdmin } = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const [minRating, setMinRating] = useState(searchParams.get('minRating') || 0)
    const [maxRating, setMaxRating] = useState(searchParams.get('maxRating') || 5)
    const navigate = useNavigate()

    let paramsGenres = searchParams.get('genres')
    if (!Array.isArray(paramsGenres)) {
        paramsGenres = paramsGenres ? [paramsGenres] : []
    }

    const searchTerm = searchParams.get('searchTerm') || ""
    const genres = paramsGenres
    const firstGenre = genres[0]

    const limit = 12
    let page = searchParams.get('page') || 1
    page = Number(page)

    const skip = (page-1) * limit

    useEffect(() => {
        (async () => {
            const products = await API.getProductsBatch(firstGenre, limit, skip, minRating, maxRating, searchTerm)

            if (products) {
                setProducts(products)
            }
        })()
    }, [ skip, page, minRating, maxRating, firstGenre, searchTerm ])

    if (page > 4 || page <= 0) {
        return <NotFoundPage />
    }

    return (
        <>
            <NavbarContainer setSearchParams={setSearchParams} searchParams={searchParams} />
            <div className={cx("prodCont")}>
                <div className={cx("titleCont")}>
                    <h1>{genres.map((genre, i) => genre + (i < genres.length - 1 ? " " : ""))}</h1>
                    {isAdmin ?
                        <StoreButton variant="filled" onMouseDown={event => navigate(ROUTES.newProduct)} >
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
                        <div className={cx("rating")}>
                            <h4>Rating</h4>
                            <StarsFilter
                                values={[ minRating, maxRating ]}
                                setValues={values => {
                                    setMinRating(values[0])
                                    setMaxRating(values[1])
                                }}
                            />
                            <CategoriesText
                                noPadding={true}
                                title="More Categories"
                                links={genresSortedByVoteCount.genresSortedByVoteCount.slice(10, 32)}
                            />
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
                <Pages setSearchParams={setSearchParams} page={page} minRating={minRating} maxRating={maxRating} genres={genres} />
            </div>
        </>
    )
}

export default ProductsPage