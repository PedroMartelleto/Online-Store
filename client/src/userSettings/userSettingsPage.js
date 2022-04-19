import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const UserSettingsPage = props => {
    return (
        <div className={cx("userSettingsPage")}>
            <h1>User Settings Page</h1>
            <p>This is the User Settings Page</p>
        </div>
    )
}

export default UserSettingsPage