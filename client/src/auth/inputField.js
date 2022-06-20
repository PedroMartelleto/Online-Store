import classNames from "classnames/bind"
import React from "react"
import styles from "./index.module.scss"
import update from "immutability-helper"
const cx = classNames.bind(styles)

const InputField = props => {
    return (
        <div className={cx("inputFieldCont")}>
            <label className={cx("label")} htmlFor={props.label}>
                {props.label}
            </label>
            <input
                id={props.label}
                type={props.type || "text"}
                value={props.userData != null ? (props.userData[props.label] || "") : ""}
                onChange={event => {
                    props.setUserData(update(props.userData, {
                        [props.label]: {
                            $set: event.target.value
                        }
                    }))
                }}
                placeholder={props.label}
            />
        </div>
    )
}

export default InputField