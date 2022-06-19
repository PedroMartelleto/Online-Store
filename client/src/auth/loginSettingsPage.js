import React, { useContext, useEffect, useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import StoreButton from "../common/storeButton"
import InputField from "./inputField"
import ResponsiveRow from "../common/responsiveRow"
import Payment from "./payment"
import Api, { AuthContext } from "../api"
import ObjectRenamer from "../api/objectRenamer"
import { ROUTES } from "../App"

const cx = classNames.bind(styles)

const LoginSettingsPage = props => {
    const { isAdmin, authToken, logout } = useContext(AuthContext)
    const [ cardData, setCardData ] = useState({})
    const [ userData, setUserData ] = useState(ObjectRenamer.fromBackend(authToken))

    useEffect(() => {
        (async () => {
            // Gets the user's card data and info
            const userData = await Api.getUser(authToken._id)

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

            const cardData = await Api.getCardData(authToken._id)
            setCardData(ObjectRenamer.fromBackend(cardData))
        })()
    }, [ authToken._id, logout ])

    // TODO: Enable save settings only when edited & validate fields

    return (
        <>
            <NavbarContainer />
            <div className={cx("loginSettingsPage")}>
                <h3>Customer info</h3>
                <div className="caption">
                    Update your info
                </div>
                <form>
                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <InputField label="First name" userData={userData} setUserData={setUserData} />
                        <InputField label="Last name" userData={userData} setUserData={setUserData} />
                    </ResponsiveRow>
                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <InputField label="Email address" userData={userData} setUserData={setUserData} />
                        <InputField label="Phone number" userData={userData} setUserData={setUserData} />
                    </ResponsiveRow>
                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <InputField label="Address" userData={userData} setUserData={setUserData} />
                        <InputField label="City" userData={userData} setUserData={setUserData} />
                    </ResponsiveRow>
                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <InputField label="State" userData={userData} setUserData={setUserData} />
                        <InputField label="ZIP/Postal code" userData={userData} setUserData={setUserData} />
                    </ResponsiveRow>

                    {isAdmin ? 
                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <InputField label="Admin list (emails)" userData={userData} setUserData={setUserData} />
                        <StoreButton className={{ [cx("submit")]: true }} variant="outlined" onMouseDown={event => window.location.href = ROUTES.manageUsers}>
                            Manage Users
                        </StoreButton>
                    </ResponsiveRow>
                    : null}

                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <StoreButton
                            className={{ [cx("submit")]: true }}
                            variant="filled"
                            onMouseDown={event => Api.mergeSettings(authToken._id, userData)}
                        >
                            Save settings
                        </StoreButton>
                        <StoreButton className={{ [cx("submit")]: true }} variant="secondary">
                            Send password change email
                        </StoreButton>
                    </ResponsiveRow>

                    {!isAdmin ? (
                        <>
                            <h3 className={cx("paymentTitle")}>
                                Payment method
                            </h3>
                            <div className="caption">
                                Please enter your payment method
                            </div>

                            <Payment cardData={cardData} setCardData={setCardData} />

                            <StoreButton
                                className={{ [cx("submit")]: true }}
                                variant="buy"
                                onMouseDown={event => Api.mergeCardData(authToken._id, cardData)}
                            >
                                Update payment method
                            </StoreButton>
                        </>
                    )
                    : null}
                </form>
            </div>
        </>
    )
}

export default LoginSettingsPage