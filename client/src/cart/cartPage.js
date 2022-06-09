import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import { StarRating, TestProduct } from "../products/productCard"
import StoreButton from "../common/storeButton"
import ResponsiveRow from "../common/responsiveRow"
const cx = classNames.bind(styles)

const ProductSummary = props => {
    const prod = props.product

    return (
        <ResponsiveRow>
            <div className={cx("prodImgContainer")}>
                <img className={cx("prodImg")} src={prod.coverLink} alt="Book cover" />
            </div>
            <div className={cx("prodDetails")}>
                <h5 style={{ fontWeight: 500 }}>{prod.title}</h5>
                <h6>{prod.author}</h6>
                <StarRating star={prod.averageRating} />
                <div className={cx("productCardTail")}>
                    <h4 style={{ fontWeight: 600 }}>
                        {prod.price + " USD"}
                    </h4>
                    {/* Number of units select */}
                    <select className={cx("prodSelect")}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
            </div>
        </ResponsiveRow>
    )
}

const CartPage = props => {
    // TODO: Where does quantity come from?
    const products = props.products || [TestProduct, TestProduct, TestProduct]

    let subtotal = 0

    for (const prod of products) {
        subtotal += prod.price
    }

    const shipping = subtotal <= 15 ? 0 : 2.99

    return (
        <>
            <NavbarContainer />
            <div className={cx("cartPage")}>
                <div className={cx("cartContainer")}>
                    <h3>
                        Order summary
                    </h3>
                    <h6>
                        Pricing can change depending on shipping method and taxes of your state.
                    </h6>
                    {
                        products.map((prod, index) => {
                            return (
                                <ProductSummary product={prod} />
                            )
                        })
                    }
                    <div className={cx("resultRow")}>
                        <h5>Subtotal</h5>
                        <h5>{subtotal} USD</h5>
                    </div>
                    <div className={cx("resultRow")}>
                        <h5>Shipping</h5>
                        <h5>{shipping} USD</h5>
                    </div>
                    <div className={cx("resultRow")}>
                        <div>
                            <h5>Total Order</h5>
                            <h6>Delivery day: TODO</h6>
                        </div>
                        <h3>{shipping + subtotal} USD</h3>
                    </div>

                </div>
                <StoreButton className={{ [cx("completeOrderBtn")]: true }} variant="buy">
                    Complete order
                </StoreButton>
            </div>
        </>
    )
}

export default CartPage