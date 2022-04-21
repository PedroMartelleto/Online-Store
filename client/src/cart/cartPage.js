import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
const cx = classNames.bind(styles)

const CartPage = props => {
    return (
        <>
            <NavbarContainer />
            <div className={cx("cartPage")}>
                <h1>Cart Page</h1>
                <p>This is the Cart Page</p>
            </div>
        </>
    )
}

export default CartPage