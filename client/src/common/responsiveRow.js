import React from "react"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const ResponsiveRow = props => {
    const { classNames, ...otherProps } = props

    return (
        <div className={cx({
            "responsiveRow": true,
            ...classNames
        })} {...otherProps}>
            {props.children}
        </div>
    )
}

export default ResponsiveRow