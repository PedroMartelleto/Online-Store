import React, { useState, useContext } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import InputField from "./inputField"
import StoreButton, { RightArrow } from "../common/storeButton"
import ResponsiveRow from "../common/responsiveRow"
import { AuthContext } from "../api"
import { Navigate, useNavigate } from "react-router"
import { ROUTES } from "../App"
import update from "immutability-helper"
const cx = classNames.bind(styles)

const LoginPage = props => {
    const [ userData, setUserData ] = useState({})
    const [ errorMsg, setErrorMsg ] = useState("")
    const { login, authenticated } = useContext(AuthContext)
    const navigate = useNavigate()

    if (authenticated) {
        return <Navigate to={ROUTES.home} />
    }

    return (
        <>
            <NavbarContainer />
            <div className={cx("loginPage")}>
                <h3>Login to your account</h3>
                <div className={cx("login")}>
                    <InputField required={true} label="Email address" userData={userData} setUserData={setUserData} />
                    <InputField required={true} type="password" label="Password" userData={userData} setUserData={setUserData} />
                </div>
                <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                    <div className={cx("btns")}>
                        <StoreButton
                            className={{ [cx("submit")]: true }}
                            variant="filled"
                            disabled={userData.ShowErrors && userData.AnyErrors}
                            onMouseDown={
                                event => {
                                    if (userData.AnyErrors) {
                                        setUserData(update(userData, {
                                            ShowErrors: {
                                                $set: true
                                            }
                                        }))
                                    }
                                    else {
                                        (async () => {
                                            const result = await login(userData)
                                            if (result != null && result.length > 0) {
                                                setErrorMsg(result)
                                            }
                                        })()
                                    }
                                }
                            }
                        >
                            Login
                        </StoreButton>
                        <div className={cx("btnsForgot")}>
                            <StoreButton className={{[cx("altBtn")]: true}} onMouseDown={event => window.prompt("Enter your email address below. You will receive an email with instructions to recover your password.")}>
                                Forgot your password?
                                <RightArrow className={cx("altArrow")} />
                            </StoreButton>
                            <StoreButton className={{[cx("altBtn")]: true}} onMouseDown={event => navigate(ROUTES.signUp) }>
                                I don't have an account
                                <RightArrow className={cx("altArrow")} />
                            </StoreButton>
                        </div>
                    </div>
                </ResponsiveRow>
                <div className={cx("validationError")}>
                    {errorMsg}
                </div>
            </div>
        </>
    )
}

export default LoginPage