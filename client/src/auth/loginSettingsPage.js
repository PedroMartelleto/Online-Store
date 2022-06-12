import React, { useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import StoreButton from "../common/storeButton"
import InputField from "./inputField"
import ResponsiveRow from "../common/responsiveRow"
import Payment from "./payment"

const cx = classNames.bind(styles)

const LoginSettingsPage = props => {
    const [userData, setUserData] = useState({})
    const [cardData, setCardData] = useState({})

    const isAdmin = true//props.isAdmin

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
                        <StoreButton className={{ [cx("submit")]: true }} variant="outlined" onMouseDown={event => window.location.href = "/user/manageUsers"}>
                            Manage Users
                        </StoreButton>
                    </ResponsiveRow>
                    : null}

                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <StoreButton className={{ [cx("submit")]: true }} variant="filled">
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

                            <StoreButton className={{ [cx("submit")]: true }} variant="buy">
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