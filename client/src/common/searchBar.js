import React from "react"

import styles from "./navbar.module.scss"
import classNames from "classnames/bind"
import { Icon } from "@iconify/react"
const cx = classNames.bind(styles)

const SearchBar = props => {
    return (
        <div className={cx("searchBar")}>
            <input type="text" placeholder="Search products, categories..."></input>
            <button className={cx("searchBarIcon")}>
                <Icon icon="bx:search" rotate={1} />
            </button>
        </div>
    )
}

export default SearchBar