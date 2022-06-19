import React from "react"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
import StoreButton from "../common/storeButton"
import { InlineIcon } from "@iconify/react"
const cx = classNames.bind(styles)

const Pages = props => {
    return (
        <div className={cx("pages")}>
            <div className={cx("pageNums")}>
                <div className={cx("pagesLabel")}>Pages:</div>
                {[1,2,3,4].map(page => (
                    <div
                        key={"page_" + page}
                        className={cx({ "pageNumber": true, "pageSelected": props.page === page })}
                        onMouseDown={event => props.setSearchParams({ page: Number(page) })}
                    >
                        {page}
                    </div>
                ))}
            </div>

            <StoreButton onMouseDown={event => {
                event.preventDefault()
                props.setSearchParams({
                    page: Number(props.page) + 1,
                    minRating: props.minRating,
                    maxRating: props.maxRating,
                    genres: props.genres
                })
                window.scrollTo({top: 0, behavior: 'smooth'})
            }} variant="filled" disabled={props.page === 4}>
                Show more products
                <InlineIcon className={cx("downArrow")} width={20} icon="eva:arrow-down-fill"/>
            </StoreButton> 

            <StoreButton onMouseDown={event => window.scrollTo({top: 0, behavior: 'smooth'})}>Navigate to top</StoreButton>
        </div>
    )
}

export default Pages