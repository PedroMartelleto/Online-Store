import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import { Link } from "react-router-dom"
import StoreButton, { RightArrow } from "./storeButton"
import { ROUTES } from "../App"
const cx = classNames.bind(styles)

const CategoriesText = props => {
    return (
        <div className={cx("categoriesText")} style={props.noPadding ? {paddingLeft: 0} : {}}>
            <h4 className={cx("categoriesTextTitle")}>
                {props.title}
            </h4>
            {props.links.map((link, _) => {
                return (
                    <Link key={"link_cat_text_" + link} className={cx("categoriesTextLink")} to={ROUTES.products + "?genres=" + link}>
                        {link}
                    </Link>
                )
            })}
            {props.button ?
            <StoreButton className={{ "categoryBtn": true }} variant="secondary" onMouseDown={event => window.location.href = ROUTES.products}>
                {props.button + "  "}
                <RightArrow />
            </StoreButton> : undefined}
        </div>
    )
}

export default CategoriesText