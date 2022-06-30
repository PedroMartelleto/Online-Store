import React, { useContext, useEffect, useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import StoreButton from "../common/storeButton"
import InputField from "./inputField"
import ResponsiveRow from "../common/responsiveRow"
import Payment, { UpdatePaymentMethodButton } from "./payment"
import API, { AuthContext } from "../api"
import ObjectRenamer from "../api/objectRenamer"
import { ROUTES } from "../App"
import update from "immutability-helper"
import { useNavigate } from "react-router"

const cx = classNames.bind(styles)

const LoginSettingsPage = props => {
    const { isAdmin, authToken, logout } = useContext(AuthContext)
    const [cardData, setCardData] = useState({})
    const [userData, setUserData] = useState(ObjectRenamer.fromBackend(authToken))
    const [errorMsg, setErrorMsg] = useState("")
    const [userSuccessMsg, setUserSuccessMsg] = useState("")
    const [cardSuccessMsg, setCardSuccessMsg] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            // Gets the user's card data and info
            const userData = await API.getUser(authToken._id)

            if (userData != null) {
                let oldUserData = localStorage.getItem('token')

                if (oldUserData == null) {
                    logout()
                }
                else {
                    // If found, updates local storage values
                    oldUserData = JSON.parse(oldUserData)
                    const newToken = Object.assign({}, userData)
                    newToken.isAdmin = oldUserData.isAdmin
                    newToken.accessToken = oldUserData.accessToken
                    localStorage.setItem('token', JSON.stringify(newToken))
                }

                setUserData(ObjectRenamer.fromBackend(userData))
            }

            if (!isAdmin) {
                const cardData = await API.getCardData()
                setCardData(ObjectRenamer.fromBackend(cardData))
            }
        })()
    }, [authToken._id, isAdmin, logout])

    return (
        <>
            <NavbarContainer />
            <div className={cx("loginSettingsPage")}>
                <h3>Customer info</h3>
                <div className="caption">
                    Update your info
                </div>
                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <InputField required={true} label="First name" userData={userData} setUserData={setUserData} />
                    <InputField required={true} label="Last name" userData={userData} setUserData={setUserData} />
                </ResponsiveRow>
                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <InputField required={true} label="Email address" userData={userData} setUserData={setUserData} />
                    <InputField required={true} label="Phone number" userData={userData} setUserData={setUserData} />
                </ResponsiveRow>
                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <InputField required={true} label="Address" userData={userData} setUserData={setUserData} />
                    <InputField required={true} label="City" userData={userData} setUserData={setUserData} />
                </ResponsiveRow>
                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <InputField required={true} label="State" userData={userData} setUserData={setUserData} />
                    <InputField required={true} label="ZIP/Postal code" userData={userData} setUserData={setUserData} />
                </ResponsiveRow>

                {isAdmin ?
                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <StoreButton className={{ [cx("submit")]: true }} variant="outlined"
                            onMouseDown={event => navigate(ROUTES.manageUsers)}>
                            Manage Users
                        </StoreButton>
                    </ResponsiveRow>
                    : null}

                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <StoreButton
                        disabled={userData.ShowErrors && userData.AnyErrors}
                        className={{ [cx("submit")]: true }}
                        variant="filled"
                        onMouseDown={event => {
                            if (userData.AnyErrors) {
                                setUserData(update(userData, {
                                    ShowErrors: {
                                        $set: true
                                    }
                                }))
                            }
                            else {
                                (async () => {
                                    const result = await API.mergeSettings(userData)
                                    if (result == null) {
                                        setErrorMsg("Error updating user info. One or more fields are invalid.")
                                    }
                                    else {
                                        setErrorMsg("")
                                        setUserSuccessMsg("User info updated successfully")
                                    }
                                })()
                            }
                        }}
                    >
                        Save settings
                    </StoreButton>
                    <StoreButton className={{ [cx("submit")]: true }} variant="secondary">
                        Send password change email
                    </StoreButton>
                </ResponsiveRow>
                <div className={cx("successMsg")}>
                    {userSuccessMsg}
                </div>

                {!isAdmin ? (
                    <>
                        <h3 className={cx("paymentTitle")}>
                            Payment method
                        </h3>
                        <div className="caption">
                            Please enter your payment method
                        </div>

                        <Payment cardData={cardData || {}} setCardData={setCardData} />
                        <UpdatePaymentMethodButton cardData={cardData || {}} setCardData={setCardData} setErrorMsg={setErrorMsg} setCardSuccessMsg={setCardSuccessMsg}  />

                        <div className={cx("validationError")}>
                            {errorMsg}
                        </div>
                        <div className={cx("successMsg")}>
                            {cardSuccessMsg}
                        </div>
                    </>
                )
                    : null}
            </div>
        </>
    )
}

export default LoginSettingsPage