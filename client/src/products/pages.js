import React, { useState } from "react"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
import StoreButton from "../common/storeButton"
import { InlineIcon } from "@iconify/react"
import { Link, Navigate, useLocation } from "react-router-dom"
const cx = classNames.bind(styles)

const Pages = props => {
    const location = useLocation()

    return (
        <div className={cx("pages")}>
            <div className={cx("pageNums")}>
                <div className={cx("pagesLabel")}>Pages:</div>
                {[1,2,3,4].map(page => (
                    <Link key={"page_" + page} to="#" className={cx({ "pageNumber": true, "pageSelected": props.page === page })}>
                        {page}
                    </Link>
                ))}
            </div>

            {props.page < 4 ? 
            <StoreButton onMouseDown={event => {
                event.preventDefault()
                props.setSearchParams({
                    page: props.page + 1
                })
            }} variant="filled">
                Show more products
            <InlineIcon icon="bx:down-arrow"/> </StoreButton> : null}

            <StoreButton onMouseDown={event => window.scrollTo({top: 0, behavior: 'smooth'})}>Navigate to top</StoreButton>
        </div>
    )
}

export default Pages