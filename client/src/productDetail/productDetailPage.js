import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import ResponsiveRow from "../common/responsiveRow"
import StoreButton, { RightArrow } from "../common/storeButton"
import NotFoundPage from "../notFound/notFoundPage"
import ProductCard, { StarRating } from "../products/productCard"
import ProductInfo from "./productInfo"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import { Link } from "react-router-dom"
import NavbarContainer from "../common/navbarContainer"
import Api, { AuthContext } from "../api"
import LoadingScreen from "../common/loadingScreen"
const cx = classNames.bind(styles)

const ProductDetailPage = props => {
    const params = useParams()
    const { isAdmin } = useContext(AuthContext)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ product, setProduct ] = useState(null)
    const [ recommendations, setRecommendations ] = useState([])
    const { id: prodId } = useParams()

    useEffect(() => {
        (async () => {
            const details = await Api.getProduct(prodId)

            if (details.recommendedBooks != null) {
                let recommended = Array.from(new Set(details.recommendedBooks.split(",").map(r => r.trim())))

                if (recommended.length > 8) {
                    recommended = recommended.slice(0, 8)
                }

                const recProducts = []

                for (const recId of recommended) {
                    const prod = await Api.getProduct(recId.trim())
                    if (prod != null) {
                        recProducts.push(prod)
                    }
                }

                setRecommendations(recProducts)
            }

            setProduct(details)
            setIsLoading(false)
        })()
    }, [ prodId, setProduct, setIsLoading, setRecommendations ])

    if (!params.id) {
        return <NotFoundPage />
    }

    console.log(recommendations)

    const prod = product

    return (
        <div>
            <NavbarContainer pathName={prod == null ? null : prod.title} />
            {!isLoading ? <>
                <div className={cx("detailContainer")}>
                    <div className={cx("detailText")}>
                        <div className={cx("title")}>
                            <h1 contentEditable={isAdmin}> {prod.title}</h1>
                            {prod.series ? <h3 contentEditable={isAdmin}>{prod.series}</h3> : undefined}
                            <h5>by <a className={cx("author")} contentEditable={isAdmin} href={prod.authorLink} target="_blank" rel="noreferrer"> {prod.author} </a></h5>
                            <div className={cx("detailRating")}>
                                <StarRating star={prod.averageRating} />
                                <span>({prod.reviewCount} customer reviews)</span>
                            </div>
                        </div>
                        <p contentEditable={isAdmin}>
                            {prod.description}
                        </p>
                        <ProductInfo product={prod} />
                    </div>
                    <img src={prod.coverLink} alt={prod.title} />
                </div>
                <div className={cx("detailRec")}>
                    <h4>Related products</h4>
                    <Link to="/products" className={cx("detailMoreBtn")}>
                        <StoreButton>
                            {"More products "}
                            <RightArrow />
                        </StoreButton>
                    </Link>
                </div>
                <ResponsiveRow classNames={{[cx("leftAligned")]: true}}>
                    {recommendations.map(prod => <ProductCard
                        key={prod.id}
                        border={false}
                        product={prod}
                    />)}
                </ResponsiveRow>
            </> : <LoadingScreen />}
        </div>
    )
}

export default ProductDetailPage