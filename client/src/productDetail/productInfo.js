import { InlineIcon } from "@iconify/react"
import React, { useContext } from "react"
import StoreButton from "../common/storeButton"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
import Api, { AuthContext } from "../api"
const cx = classNames.bind(styles)

const ProductInfo = props => {
    const prod = props.product
    const { isAdmin, authToken } = useContext(AuthContext)

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
                    <p contentEditable={isAdmin}>{prod.publisher}</p>
                    <p contentEditable={isAdmin}>{prod.datePublished}</p>
                    <p contentEditable={isAdmin}>{prod.reviewCount}</p>
                    <p contentEditable={isAdmin}>{prod.numberOfPages}</p>
                </div>
            </div>
            <div className={cx("price")}>
                <div className={cx("actions")}>
                    <h2 contentEditable={isAdmin}>
                        {prod.price}
                    </h2>
                    <h2>
                        {"USD"}
                    </h2>
                </div>
                <div className={cx("actions")}>
                    <StoreButton variant="buy" onMouseDown={event => Api.addProductToCart(authToken._id, prod._id) }>
                        {!isAdmin ?
                        <>
                            <InlineIcon icon="bx:plus" />
                            {"  Add to cart"}
                        </> : "Confirm changes"}
                    </StoreButton>
                    {isAdmin ?
                        <StoreButton className={{[cx("archiveBtn")]: true}} variant="buy" >
                            Archive
                        </StoreButton>
                    : null}
                </div>
            </div>
        </div>
    )
}

export default ProductInfo