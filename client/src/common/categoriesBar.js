import React from "react"

import styles from "./navbar.module.scss"
import classNames from "classnames/bind"
import ResponsiveRow from "./responsiveRow"
import { useNavigate } from "react-router"
import { ROUTES } from "../App"
const cx = classNames.bind(styles)

const CategoriesBar = props => {
    const { categories } = props
    const navigate = useNavigate()

    return (
        <ResponsiveRow className={cx("categoriesBar")}>
            {categories.map(category => (
                <button
                    key={category}
                    className={cx("categoriesBarBtn")}
                    onClick={() => {
                        navigate(ROUTES.products + "?genres=" + category)
                    }}
                >
                    <h5>
                        {category}
                    </h5>
                </button>
            ))}
        </ResponsiveRow>
    )
}

export default CategoriesBar