import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const CartPage = props => {
    return (
        <div className={cx("cartPage")}>
            <h1>Cart Page</h1>
            <p>This is the Cart Page</p>
        </div>
    )
}

export default CartPage