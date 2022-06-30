import classNames from "classnames/bind"
import React from "react"
import styles from "./index.module.scss"
import update from "immutability-helper"
const cx = classNames.bind(styles)

const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
const cvvRegex = /^[0-9]{3,4}$/
const cardExpiryRegex = /\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/
const cardHolderRegex = /^[a-zA-Z ]+$/

const ValidationFunctions = {
    "RequiredField": field => {
        if (field != null || typeof field !== 'string' || !(field instanceof String) || field.length <= 0) {
            return "This field is required"
        }
        else {
            return null
        }
    },
    "Email address": email => {
        if (!email) return null

        // eslint-disable-next-line
        if (!email || email.length <= 0 || !email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
            return "Invalid e-mail address"
        }
        else {
            return null
        }
    },
    "Phone number": phone => {
        if (!phone || phone.length <= 0 || phone.match(/[a-z]/i)) {
            return "Invalid phone number"
        }
        else {
            return null
        }
    },
    "ZIP/Postal code": zip => {
        if (!zip || zip.length <= 0 || zip.match(/[a-z]/i)) {
            return "Invalid ZIP code"
        }
        else {
            return null
        }
    },
    "Password": pwd => {
        return pwd.length <= 4 ? "Password must be at least 4 characters long" : null
    },
    "Confirm password": (confirmPassword, userData) => {
        const pwd = userData["Password"]
        return pwd !== confirmPassword ? "Passwords don't match" : null
    },
    "Card number": cardNumber => {
        if (!cardNumber || cardNumber.length <= 0 || !cardNumber.match(cardNumberRegex)) {
            return "Invalid card number"
        }
        else {
            return null
        }
    },
    "CVV": cvv => {
        if (!cvv || cvv.length <= 0 || !cvv.match(cvvRegex)) {
            return "Invalid CVV"
        }
        else {
            return null
        }
    },
    "Expiration date": expiry => {
        if (!expiry || expiry.length <= 0 || !expiry.match(cardExpiryRegex)) {
            return "Invalid card expiry"
        }
        else {
            return null
        }
    },
    "Card holder": holder => {
        if (!holder || holder.length <= 0 || !holder.match(cardHolderRegex)) {
            return "Invalid card holder name"
        }
        else {
            return null
        }
    }
}

function validateField(props, newValue) {
    const validateFn = ValidationFunctions[props.label]
    let content = props.userData != null ? (props.userData[props.label] || "") : ""
    if (newValue != null) {
        content = newValue
    }

    let validationError = validateFn == null ? null : validateFn(content, props.userData)

    if (validationError == null && props.required && !ValidationFunctions.RequiredField(content)) {
        validationError = "Required field"
    }
    
    return validationError
}

const InputField = props => {
    const content = props.userData != null ? (props.userData[props.label] || "") : ""
    const validationError = validateField(props)

    return (
        <div className={cx({
            "inputFieldCont": true
        })}>
            <label className={cx("label")} htmlFor={props.label}>
                {props.label}
            </label>
            <input
                className={cx({
                    "error": validationError != null && props.userData != null && props.userData.ShowErrors
                })}
                id={props.label}
                type={props.type || "text"}
                value={content}
                onChange={event => {
                    const validationError = validateField(props, event.target.value)
                    
                    props.setUserData(update(props.userData, {
                        [props.label]: {
                            $set: event.target.value
                        },
                        AnyErrors: {
                            $set: validationError != null
                        }
                    }))
                }}
                placeholder={props.label}
            />
            <div className={cx("validationError")}>
                {props.userData != null && props.userData.ShowErrors ? validationError : null}
            </div>
        </div>
    )
}

export { InputField as default, ValidationFunctions }