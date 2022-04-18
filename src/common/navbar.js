import React from "react"
import SearchBar from "./searchBar"
import CategoriesBar from "./categoriesBar"

import styles from "./navbar.module.scss"
import { Icon } from "@iconify/react"
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const NavbarButton = (props) => {
    return (
        <button className={cx("btn")}>
            <Icon icon={props.icon} />
        </button>
    )
}

const Navbar = (props) => {
    return (
        <div className={cx("verticalContainer")}>
            <div className={cx("container")}>
                <img src="https://i.imgur.com/2RrwTeT.png" alt="book store icon"
                     className={cx("logo")}
                     onMouseDown={event => window.location.href = "/"}
                />
                <SearchBar/>
                <div className={cx("btnsContainer")}>
                    <NavbarButton icon="bx:user" />
                    <NavbarButton icon="bx:cart" />
                </div>
            </div>
            <CategoriesBar categories={["Fiction", "Science"]} />
        </div>
    )
}

export default Navbar