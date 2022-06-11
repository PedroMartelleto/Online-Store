import React, { useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import InputField from "./inputField"
import ResponsiveRow from "../common/responsiveRow"
import StoreButton from "../common/storeButton"
import Payment from "./payment"
import CheckBox from "../common/checkBox"

const cx = classNames.bind(styles)

const SignUpPage = props => {
    const [userData, setUserData] = useState({})
    const [cardData, setCardData] = useState({})
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    return (
        <>
            <NavbarContainer />
            <div className={cx("loginSettingsPage")}>
                <h3>Customer info</h3>
                <div className="caption">
                    Please fill the required fields below
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

                    <h3 className={cx("paymentTitle")}>
                        Payment method
                    </h3>
                    <div className="caption">
                        Please enter your payment method
                    </div>

                    <Payment cardData={cardData} setCardData={setCardData} />

                    <h3 className={cx("paymentTitle")}>
                        Confirmation
                    </h3>

                    <CheckBox
                        id="chk-agree"
                        label="I agree with the terms and conditions and privacy policy." 
                        value={agreeToTerms}
                        setValue={setAgreeToTerms}
                    />

                    <StoreButton disabled={!agreeToTerms} className={{ [cx("submit")]: true }} variant="buy">
                        Create account
                    </StoreButton>
                </form>
            </div>
        </>
    )
}

export default SignUpPage