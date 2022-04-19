import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const LoginPage = props => {
    return (
        <div className={cx("loginPage")}>
            <form>
                <div className={cx("field", "email")}>
                    <label>E-mail </label>
                    <input type="text" name="uname" required />
                </div>
                <div className={cx("field", "password")}>
                    <label>Password </label>
                    <input type="password" name="pass" required />
                </div>
                <div className={cx("submit")}>
                    <input type="submit" />
                </div>
            </form>
        </div>
    )
}

export default LoginPage