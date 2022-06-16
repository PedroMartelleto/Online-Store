import React, { useContext, useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import InputField from "./inputField"
import ResponsiveRow from "../common/responsiveRow"
import StoreButton from "../common/storeButton"
import CheckBox from "../common/checkBox"
import { AuthContext } from "../api"
import { Navigate } from "react-router"
import { ROUTES } from "../App"

const cx = classNames.bind(styles)

const SignUpPage = props => {
    const [ userData, setUserData ] = useState({})
    const [ agreeToTerms, setAgreeToTerms ] = useState(false)
    const { register, authenticated } = useContext(AuthContext)

    if (authenticated) {
        return <Navigate to={ROUTES.home} />
    }

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
                    <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                        <InputField type="password" label="Password" userData={userData} setUserData={setUserData} />
                        <InputField type="password" label="Confirm Password" userData={userData} setUserData={setUserData} />
                    </ResponsiveRow>

                    <h3 className={cx("paymentTitle")}>
                        Confirmation
                    </h3>

                    <CheckBox
                        id="chk-agree"
                        label="I agree with the terms and conditions and privacy policy." 
                        value={agreeToTerms}
                        setValue={setAgreeToTerms}
                    />

                    <StoreButton disabled={!agreeToTerms} className={{ [cx("submit")]: true }} variant="buy"
                                onMouseDown={event => register(userData)}>
                        Create account
                    </StoreButton>
                </form>
            </div>
        </>
    )
}

export default SignUpPage