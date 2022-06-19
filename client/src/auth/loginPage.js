import React, { useState, useContext } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import InputField from "./inputField"
import StoreButton, { RightArrow } from "../common/storeButton"
import ResponsiveRow from "../common/responsiveRow"
import { AuthContext } from "../api"
import { Navigate } from "react-router"
import { ROUTES } from "../App"
const cx = classNames.bind(styles)

const LoginPage = props => {
    const [ userData, setUserData ] = useState({})
    const { login, authenticated } = useContext(AuthContext)

    if (authenticated) {
        return <Navigate to={ROUTES.home} />
    }

    return (
        <>
            <NavbarContainer />
            <div className={cx("loginPage")}>
                <h3>Login to your account</h3>
                <div className={cx("login")}>
                    <InputField label="Email address" userData={userData} setUserData={setUserData} />
                    <InputField type="password" label="Password" userData={userData} setUserData={setUserData} />
                </div>
                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <div className={cx("btns")}>
                        <StoreButton className={{ [cx("submit")]: true }} variant="filled" onMouseDown={
                            event => {
                                event.preventDefault()
                                login(userData)
                            }
                        }>
                            Login
                        </StoreButton>
                        <div className={cx("btnsForgot")}>
                            <StoreButton className={{[cx("altBtn")]: true}} onMouseDown={event => window.prompt("Enter your email address below. You will receive an email with instructions to recover your password.")}>
                                Forgot your password?
                                <RightArrow className={cx("altArrow")} />
                            </StoreButton>
                            <StoreButton className={{[cx("altBtn")]: true}} onMouseDown={event => window.location.href = ROUTES.signUp }>
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