import React from "react"
import { InlineIcon } from "@iconify/react"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const RightArrow = props => <InlineIcon icon="bxs:right-arrow" />
const LeftArrow = props => <InlineIcon icon="bxs:left-arrow" />

const StoreButton = props => {
    return (
        <button className={cx({
            "btn": true,
            "btnOutlined": props.variant === "outlined",
            "btnFilled": props.variant === "filled",
            "btnSecondary": props.variant === "secondary",
            "btnBuy": props.variant === "buy",
            ...(props.className || {})
        })}>
            {props.children}
        </button>
    )
}

export { StoreButton as default, RightArrow, LeftArrow }