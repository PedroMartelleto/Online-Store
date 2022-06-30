import React from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "../App"
import styles from "./index.module.scss"

const OrderCompletePage = props => {
    return (
        <div style={{padding: 40}}>
            <h1>Order complete</h1>
            <h4 style={{marginTop: 10, marginBottom: 20}}>Thank you for your purchase! Your order will be arriving in the next few days. Happy reading!</h4>
            <Link className={styles.backToHome} to={ROUTES.home}>
                Go back to the home page
            </Link>
        </div>
    )
}

export default OrderCompletePage