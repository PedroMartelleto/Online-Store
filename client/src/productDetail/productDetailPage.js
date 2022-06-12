import React from "react"
import { useParams } from "react-router"
import ResponsiveRow from "../common/responsiveRow"
import StoreButton, { RightArrow } from "../common/storeButton"
import NotFoundPage from "../notFound/notFoundPage"
import ProductCard, { StarRating, TestProduct } from "../products/productCard"
import ProductInfo from "./productInfo"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
import { Link } from "react-router-dom"
import NavbarContainer from "../common/navbarContainer"
const cx = classNames.bind(styles)

const ProductDetailPage = props => {
    const params = useParams()
    const isAdmin = true // props.isAdmin

    if (!params.id) {
        return <NotFoundPage />
    }

    const prod = props.product || TestProduct

    return (
        <div>
            <NavbarContainer />
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
            <ResponsiveRow>
                <ProductCard
                    border={false}
                    product={TestProduct}
                />
                <ProductCard
                    border={false}
                    product={TestProduct}
                />
                <ProductCard
                    border={false}
                    product={TestProduct}
                />
                <ProductCard
                    border={false}
                    product={TestProduct}
                />
            </ResponsiveRow>
        </div>
    )
}

export default ProductDetailPage