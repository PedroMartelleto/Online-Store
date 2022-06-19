import React, { useContext, useEffect, useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbar"
import StoreButton from "../common/storeButton"
import { ROUTES } from "../App"
import { Navigate, useNavigate } from "react-router"
import { AdminAPI, AuthContext } from "../api"
import update from "immutability-helper"
const cx = classNames.bind(styles)

const ManageUsers = props => {
    const { isAdmin, logout, authToken } = useContext(AuthContext)
    const [ usersList, setUsersList ] = useState([])
    const navigate = useNavigate()
    
    useEffect(() => {
        (async () => {
            let users = await AdminAPI.getUsersList()
            if (users != null) {
                users = users.filter(user => user._id !== authToken._id)
                setUsersList(users)
            }
        })()
    }, [])

    if (!isAdmin) {
        return <Navigate to={ROUTES.home} />
    }

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
                        onMouseDown={event => {
                            logout()
                            navigate(ROUTES.signUp)
                        }}
                    >
                        Create account
                    </StoreButton>
                </div>
                {usersList != null ? usersList.map((user, userIndex) => {
                    return (
                        <div className={cx("user")} key={user.email}>
                            <div className={cx("userEmail")}>
                                {user.email + " (" + user.name + ")"}
                            </div>
                            <div className={cx("rightBtns")}>
                                <StoreButton
                                    variant="buy"
                                    className={{ [cx("delete")]: true }}
                                    onMouseDown={event => {
                                        (async () => {
                                            await AdminAPI.toggleAdmin(user)

                                            setUsersList(update(usersList, {
                                                [userIndex]: {
                                                    isAdmin: { $set: !user.isAdmin }
                                                }
                                            }))
                                        })()
                                    }}>
                                    {user.isAdmin ? "Remove admin" : "Make admin"}
                                </StoreButton>
                                <StoreButton
                                    className={{ [cx("delete")]: true }}
                                    variant="secondary"
                                    disabled={user.isAdmin}
                                    onMouseDown={event => {
                                        (async () => {
                                            await AdminAPI.deleteUser(user._id)

                                            setUsersList(update(usersList, {
                                                $splice: [[userIndex, 1]]
                                            }))
                                        })()
                                    }}>
                                    Delete
                                </StoreButton>
                            </div>
                        </div>
                    )
                }) : null}
            </div>
        </div>
    )
}

export default ManageUsers
