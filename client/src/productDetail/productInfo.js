import { InlineIcon } from "@iconify/react"
import React, { useContext } from "react"
import StoreButton from "../common/storeButton"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import API, { AuthContext } from "../api"
const cx = classNames.bind(styles)

function findInCart(cartSummary, prodId) {
    for (let i = 0; i < cartSummary.length; ++i) {
        if (String(cartSummary[i].productId) === String(prodId)) {
            return i
        }
    }
    return -1
}

const AddToCartButton = ({ prod, cartSummary, setCartSummary, isAdmin }) => {
    let indexInCart = findInCart(cartSummary, prod._id)

    return (
        <StoreButton
            variant="buy"
            onMouseDown={event => {
                (async() => {
                    if (!isAdmin) {
                        if (cartSummary == null) {
                            console.warn("Cart summary should never be null at this point.")
                            return
                        }

                        indexInCart = findInCart(cartSummary, prod._id)
                        
                        if (indexInCart < 0) {
                            const newSummary = await API.addProductToCart(prod._id)
                            if (newSummary != null) setCartSummary(newSummary)
                        }
                        else {
                            const newSummary = await API.removeProductFromCart(prod._id)
                            if (newSummary != null) setCartSummary(newSummary)
                        }
                    }
                })()
            }}>
            {!isAdmin ? (indexInCart < 0 ?
                <div className={cx("addToCart")}>
                    <InlineIcon className={cx("plus")} icon="mdi:plus" width={22} />
                    <span>Add to cart</span>
                </div>
                : <div className={cx("addToCart")}>
                    <InlineIcon className={cx("plus")} icon="mdi:minus" width={22} />
                    <span>Remove from cart</span>
                </div>)
                : "Confirm changes"}
        </StoreButton>
    )
}

const ProductInfo = props => {
    const prod = props.product
    const { isAdmin, cartSummary, setCartSummary } = useContext(AuthContext)

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
                    <AddToCartButton
                        prod={prod}
                        cartSummary={cartSummary}
                        setCartSummary={setCartSummary}
                        isAdmin={isAdmin}
                    />
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