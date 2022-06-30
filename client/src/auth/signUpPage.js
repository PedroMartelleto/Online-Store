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
import update from "immutability-helper"

const cx = classNames.bind(styles)

const SignUpPage = props => {
    const [ userData, setUserData ] = useState({})
    const [ agreeToTerms, setAgreeToTerms ] = useState(false)
    const { register, authenticated } = useContext(AuthContext)
    const [ errorMsg, setErrorMsg ] = useState("")

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
                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <InputField required={true} type="password" label="Password" userData={userData} setUserData={setUserData} />
                    <InputField required={true} type="password" label="Confirm Password" userData={userData} setUserData={setUserData} />
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

                <StoreButton disabled={!agreeToTerms || (userData.ShowErrors && userData.AnyErrors)} className={{ [cx("submit")]: true }} variant="buy"
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
                                        const result = await register(userData)
                                        if (result != null) {
                                            setErrorMsg(result)
                                        }
                                    })()
                                }
                            }}>
                    Create account
                </StoreButton>
                <div className={cx("validationError")}>
                    {errorMsg}
                </div>
            </div>
        </>
    )
}

export default SignUpPage