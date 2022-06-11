import classNames from "classnames/bind"
import React from "react"
import styles from "./index.module.scss"

const cx = classNames.bind(styles)

const CheckBox = props => {
    return (
        <div className={cx("checkbox")}>
            <input value={props.value} type="checkbox" id={props.id} onChange={event => props.setValue(!props.value) } />
            <label className={cx("checkboxLabel")} htmlFor={props.id}>
                {props.label}
            </label>
        </div>
    )
}

export default CheckBox