import { InlineIcon } from "@iconify/react"
import React from "react"
import StoreButton from "../common/storeButton"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const ProductInfo = props => {
    const prod = props.product

    return (
        <div className={cx("prodInfo")}>
            <div className={cx("infoCont")}>
                <div className={cx("infoLabel")}>
                    <p>Publisher:</p>
                    <p>Date published:</p>
                    <p>Review count:</p>
                    <p>Page count:</p>
                </div>
                <div className={cx("infoValue")}>
                    <p>{prod.publisher}</p>
                    <p>{prod.datePublished}</p>
                    <p>{prod.reviewCount}</p>
                    <p>{prod.numberOfPages}</p>
                </div>
            </div>
            <div className={cx("price")}>
                <h2>
                    {prod.price + " USD"}
                </h2>
                <StoreButton variant="buy">
                    <InlineIcon icon="bx:plus" />
                    {"  Add to cart"}
                </StoreButton>
            </div>
        </div>
    )
}

export default ProductInfo