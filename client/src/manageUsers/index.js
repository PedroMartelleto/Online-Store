import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbar"
const cx = classNames.bind(styles)

const ManageUsers = props => {
    return (
        <div>
            <NavbarContainer />
            <div className={cx("manageUsersPage")}>
            </div>
        </div>
    )
}

export default ManageUsers
