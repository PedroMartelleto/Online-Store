import React, { useContext, useState } from "react"
import SearchBar from "./searchBar"
import CategoriesBar from "./categoriesBar"

import styles from "./navbar.module.scss"
import { Icon } from "@iconify/react"
import classNames from "classnames/bind"
import { AuthContext } from "../api"
import { Navigate, useLocation } from "react-router"
import { ROUTES } from "../App"
import StoreButton from "./storeButton"
const cx = classNames.bind(styles)

const NavbarButton = (props) => {
    return (
        <button {...props} className={cx("btn")}>
            <Icon icon={props.icon} />
        </button>
    )
}

const Navbar = (props) => {
    const { isAdmin, authenticated } = useContext(AuthContext)

    const [ navToSettings, setNavToSettings ] = useState(false)
    const [ navToCart, setNavToCart ] = useState(false)
    const [ navToCreateProduct, setNavToCreateProduct ] = useState(false)
    const location = useLocation()

    // TODO: Fix icons in this page

    if (navToSettings) {
        return <Navigate to={ROUTES.userSettings} />
    }

    if (navToCart) {
        return <Navigate to={ROUTES.userCart} />
    }

    if (navToCreateProduct) {
        return <Navigate to={ROUTES.newProduct} />
    }

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
                        <NavbarButton icon="bx:user" onMouseDown={event => setNavToSettings(true)} />
                        {isAdmin ? null : <NavbarButton icon="bx:cart" onMouseDown={event => setNavToCart(true)} />}
                    </> : <StoreButton disabled={location.pathname === ROUTES.login} onMouseDown={event => {
                        if (location.pathname !== ROUTES.login) {
                            window.location.href = ROUTES.login
                        }
                    }}>
                            Login
                        </StoreButton>
                    }
                </div>
            </div>
            <CategoriesBar categories={["Fiction", "Psychology", "Horror", "Science Fiction", "Humor", "Apocalyptic"]} />
        </div>
    )
}

export default Navbar