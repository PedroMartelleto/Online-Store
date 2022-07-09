import React, { useContext, useEffect, useState } from "react"
import SearchBar from "./searchBar"
import CategoriesBar from "./categoriesBar"

import styles from "./navbar.module.scss"
import { Icon } from "@iconify/react"
import classNames from "classnames/bind"
import { AuthContext } from "../api"
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
    const { isAdmin, authenticated, logout, cartSummary } = useContext(AuthContext)

    const [ searchTermEdit, setSearchTermEdit ] = useState(props.searchParams == null ? "" : (props.searchParams.get('searchTerm') || ""))

    const location = useLocation()
    const navigate = useNavigate()
    const cartSize = cartSummary != null ? cartSummary.length : 0

    useEffect(() => {
        if (props.searchParams != null && props.searchParams.get('searchTerm') == null) {
            setSearchTermEdit("")
        }
    }, [])

    return (
        <div className={cx("verticalContainer")}>
            <div className={cx("container")}>
                <img src="https://i.imgur.com/2RrwTeT.png" alt="book store icon"
                     className={cx("logo")}
                     onMouseDown={event => navigate(ROUTES.home)}
                />
                <SearchBar
                    setSearchParams={props.setSearchParams}
                    searchParams={props.searchParams}
                    searchTermEdit={searchTermEdit}
                    setSearchTermEdit={setSearchTermEdit}
                />
                <div className={cx("btnsContainer")}>
                    {authenticated ? (
                        <>
                            <NavbarButton icon="bx:user" onMouseDown={event => navigate(ROUTES.userSettings)} />
                            {isAdmin ? null : <CartSummary cartSize={cartSize} navigate={navigate} />}
                        </>)
                        : (
                            <StoreButton disabled={location.pathname === ROUTES.login}
                                onMouseDown={event => {
                                    if (location.pathname !== ROUTES.login) {
                                        navigate(ROUTES.login)
                                    }
                                }}>
                                Login/Sign Up
                            </StoreButton>
                        )
                    }
                    {authenticated ? <StoreButton
                        variant={cx("compact")}
                        onMouseDown={event => {
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