import React, { useContext, useEffect, useState } from "react"
import SearchBar from "./searchBar"
import CategoriesBar from "./categoriesBar"

import styles from "./navbar.module.scss"
import { Icon } from "@iconify/react"
import classNames from "classnames/bind"
import Api, { AuthContext } from "../api"
import { useLocation, useNavigate } from "react-router"
import { ROUTES } from "../App"
import StoreButton from "./storeButton"
import genresSortedByVoteCount from "../genresSortedByVoteCount.json"

const cx = classNames.bind(styles)

const NavbarButton = (props) => {
    return (
        <button {...props} className={cx("btn")}>
            <Icon icon={props.icon} />
        </button>
    )
}

const CartSummary = ({ cartSize, navigate }) => {
    return (
        <div className={cx("cartSummary")}>
            <NavbarButton icon="bx:cart" onMouseDown={event => navigate(ROUTES.userCart)} />
            <div className={cx("cartSize")}>
                <div className={cx("cartSizeNum")}>
                    {cartSize}
                </div>
            </div>
        </div>
    )
}

const Navbar = (props) => {
    const { isAdmin, authenticated, logout, cartSize, setCartSize } = useContext(AuthContext)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            const cartSize = await Api.getCartSize()
            setCartSize(cartSize)
        })()
    }, [])

    return (
        <div className={cx("verticalContainer")}>
            <div className={cx("container")}>
                <img src="https://i.imgur.com/2RrwTeT.png" alt="book store icon"
                     className={cx("logo")}
                     onMouseDown={event => window.location.href = ROUTES.home}
                />
                <SearchBar/>
                <div className={cx("btnsContainer")}>
                    {authenticated ? <>
                        <NavbarButton icon="bx:user" onMouseDown={event => navigate(ROUTES.userSettings)} />
                        {isAdmin ? null : <CartSummary cartSize={cartSize} navigate={navigate} />}
                    </> : <StoreButton disabled={location.pathname === ROUTES.login} onMouseDown={event => {
                        if (location.pathname !== ROUTES.login) {
                            window.location.href = ROUTES.login
                        }
                    }}>
                            Login/Sign Up
                        </StoreButton>
                    }
                    {authenticated ? <StoreButton onMouseDown={event => {
                            logout()
                            navigate(ROUTES.home)
                        }}>
                            Logout
                        </StoreButton> : undefined}
                </div>
            </div>
            <CategoriesBar categories={genresSortedByVoteCount.genresSortedByVoteCount.slice(0,10)} />
        </div>
    )
}

export default Navbar