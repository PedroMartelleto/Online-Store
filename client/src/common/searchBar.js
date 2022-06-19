import React from "react"

import styles from "./navbar.module.scss"
import classNames from "classnames/bind"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router"
import { ROUTES } from "../App"
const cx = classNames.bind(styles)

const SearchBar = props => {
    const navigate = useNavigate()

    return (
        <div className={cx("searchBar")}>
            <input
                value={props.searchTermEdit}
                type="text"
                placeholder="Search products, categories..."
                onChange={event => props.setSearchTermEdit(event.target.value)} />    
            <button
                disabled={props.searchTermEdit == null || props.searchTermEdit.length <= 0}
                className={cx("searchBarIcon")}
                onClick={() => {
                    if (props.setSearchParams != null) {
                        props.setSearchParams({
                            ...props.searchParams,
                            searchTerm: props.searchTermEdit
                        })
                    }
                    else {
                        navigate(ROUTES.products + "?searchTerm=" + props.searchTermEdit)
                    }
                }}
                >
                <Icon icon="bx:search" rotate={1} />
            </button>
        </div>
    )
}

export default SearchBar