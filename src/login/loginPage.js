import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const LoginPage = props => {
    return (
        <div className={cx("loginPage")}>
            <h1>Login Page</h1>
            <p>This is the Login Page</p>
        </div>
    )
}

export default LoginPage