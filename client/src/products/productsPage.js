import React from "react"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
import ProductCard, { StarRating, TestProduct } from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
import CategoriesText from "../common/categoriesText"
const cx = classNames.bind(styles)

const ProductsPage = props => {
    const filters = []

    return <div className={cx("prodCont")}>
            <h1>Fiction</h1>
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
                            <div className={cx("stars")}>
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                <label className="form-check-label" for="flexCheckChecked" />
                                <StarRating star={5} />
                            </div>
                            <div className={cx("stars")}>
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                <label className="form-check-label" for="flexCheckChecked" />
                                <StarRating star={4} />
                            </div>
                            <div className={cx("stars")}>
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                <label className="form-check-label" for="flexCheckChecked" />
                                <StarRating star={3} />
                            </div>
                            <div className={cx("stars")}>
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                <label className="form-check-label" for="flexCheckChecked" />
                                <StarRating star={2} />
                            </div>
                            <div className={cx("stars")}>
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                <label className="form-check-label" for="flexCheckChecked" />
                                <StarRating star={1} />
                            </div>
                        </div>
                    </div>
                    <ResponsiveRow noPadding={true}>
                        <ProductCard
                            border={true}
                            product={TestProduct}
                        />
                        <ProductCard
                            border={true}
                            product={TestProduct}
                        />
                        <ProductCard
                            border={true}
                            product={TestProduct}
                        />
                        
                    </ResponsiveRow>
                </div>
        </div>
}

export default ProductsPage