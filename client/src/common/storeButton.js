import React from "react"
import { InlineIcon } from "@iconify/react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const RightArrow = props => <InlineIcon {...props} icon="bxs:right-arrow" color={props.color || "#EE316D"} width={12} />
const LeftArrow = props => <InlineIcon {...props} icon="bxs:left-arrow" color={props.color || "#EE316D"} width={12} />

const StoreButton = props => {
    return (
        <button {...props} className={cx({
            "btn": true,
            "btnCompact": props.variant === "compact",
            "btnOutlined": props.variant === "outlined",
            "btnFilled": props.variant === "filled",
            "btnSecondary": props.variant === "secondary",
            "btnBuy": props.variant === "buy",
            "btnNoFill": props.variant == null,
            "btnDisabled": props.disabled,
            ...(props.className || {})
        })}>
            {props.children}
        </button>
    )
}

export { StoreButton as default, RightArrow, LeftArrow }