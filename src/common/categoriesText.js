import React from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import { Link } from "react-router-dom"
import StoreButton, { RightArrow } from "./storeButton"
const cx = classNames.bind(styles)

const CategoriesText = props => {
    return (
        <h4 className={cx("categoriesText")} style={props.noPadding ? {paddingLeft: 0} : {}}>
            <div className={cx("categoriesTextTitle")}>
                {props.title}
            </div>
            {props.links.map((link, _) => {
                return (
                    <Link key={"link_cat_text_" + link} className={cx("categoriesTextLink")} to={"#" + link.toLowerCase().replaceAll(" ", "-")}>
                        {link}
                    </Link>
                )
            })}
            {props.button ?
            <StoreButton className={{ "categoryBtn": true }} variant="secondary" onMouseDown={event => window.location.href = "/products"}>
                {props.button + "  "}
                <RightArrow />
            </StoreButton> : undefined}
        </h4>
    )
}

export default CategoriesText