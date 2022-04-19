import React from "react"

import styles from "./navbar.module.scss"
import classNames from "classnames/bind"
import ResponsiveRow from "./responsiveRow"
const cx = classNames.bind(styles)

const CategoriesBar = props => {
    const { categories } = props
    return (
        <ResponsiveRow className={cx("categoriesBar")}>
            {categories.map(category => (
                <button
                    key={category}
                    className={cx("categoriesBarBtn")}
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