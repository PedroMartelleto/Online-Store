import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import StoreButton from "../common/storeButton"
const cx = classNames.bind(styles)

const LoginSettingsPage = props => {
    return (
        <div className={cx("loginSettingsPage")}>
            <form>
                <StoreButton>Request password change</StoreButton>
                <div className={cx("field")}>
                    <label>Change credit card </label>
                    <input type="number" name="pass" required />
                </div>
                <div className={cx("submit")}>
                    <input type="submit" />
                </div>
            </form>
        </div>
    )
}

export default LoginSettingsPage