import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbar"
import StoreButton from "../common/storeButton"
import { ROUTES } from "../App"
const cx = classNames.bind(styles)

const ManageUsers = props => {
    const users = 
    [
        { email: "email1@something.com", name: "User 1" },
        { email: "email2@something.com", name: "User 2" },
        { email: "email3@something.com", name: "User 3" }
    ]
    //props.users

    return (
        <div>
            <NavbarContainer />
            <div className={cx("manageUsersPage")}>
                <div className={cx("titleCont")}>
                    <div>
                        <h1>Manage users</h1>
                        <div className="caption">
                            Create and delete accounts
                        </div>
                    </div>
                    <StoreButton
                        className={{ [cx("createAccount")]: true }}
                        variant="outlined"
                        onMouseDown={event => document.location.href = ROUTES.signUp}
                    >
                        Create account
                    </StoreButton>
                </div>
                {users.map(user => {
                    return (
                        <div className={cx("user")} key={user.email}>
                            <div className={cx("userEmail")}>
                                {user.email + " (" + user.name + ")"}
                            </div>
                            <StoreButton className={{ [cx("delete")]: true }} variant="secondary">
                                Delete
                            </StoreButton>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ManageUsers
