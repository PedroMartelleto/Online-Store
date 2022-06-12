import React, { useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import InputField from "./inputField"
import StoreButton, { RightArrow } from "../common/storeButton"
import ResponsiveRow from "../common/responsiveRow"
import CoreBackend from "../backend/coreBackend"
const cx = classNames.bind(styles)

const LoginPage = props => {
    const [ userData, setUserData ] = useState({})

    return (
        <>
            <NavbarContainer />
            <div className={cx("loginPage")}>
                <h3>Login to your account</h3>
                <div className={cx("login")}>
                    <InputField label="Email address" userData={userData} setUserData={setUserData} />
                    <InputField label="Password" userData={userData} setUserData={setUserData} />
                </div>
                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <div className={cx("btns")}>
                        <StoreButton className={{ [cx("submit")]: true }} variant="filled" onMouseDown={
                            event => {
                                event.preventDefault()
                                CoreBackend.login(userData["Email address"], userData["Password"])
                            }
                        }>
                            Login
                        </StoreButton>
                        <div className={cx("btnsForgot")}>
                            <StoreButton className={{[cx("altBtn")]: true}}>
                                Forgot your password?
                                <RightArrow className={cx("altArrow")} />
                            </StoreButton>
                            <StoreButton className={{[cx("altBtn")]: true}} onMouseDown={event => window.location.href = "/signUp" }>
                                I don't have an account
                                <RightArrow className={cx("altArrow")} />
                            </StoreButton>
                        </div>
                    </div>
                </ResponsiveRow>
            </div>
        </>
    )
}

export default LoginPage