import React from "react"
import ResponsiveRow from "../common/responsiveRow"
import InputField from "./inputField"
import classNames from "classnames/bind"
import styles from "./index.module.scss"
import StoreButton from "../common/storeButton"
import update from "immutability-helper"
import API from "../api"

const cx = classNames.bind(styles)

const UpdatePaymentMethodButton = ({ disabled, cardData, setCardData, setErrorMsg, setCardSuccessMsg, label, customCallback }) => {
    return <StoreButton
        className={{ [cx("submit")]: true }}
        variant="buy"
        disabled={disabled}
        onMouseDown={event => {
            event.preventDefault()

            if (cardData.AnyErrors) {
                setCardData(update(cardData, {
                    ShowErrors: {
                        $set: true
                    }
                }))
            }
            else {
                (async () => {
                    const result = await API.mergeCardData(cardData)
                    if (result == null) {
                        setErrorMsg("Provided invalid card data")
                    }
                    else {
                        if (setCardSuccessMsg != null) {
                            setCardSuccessMsg("Card data updated successfully")
                        }
                        setErrorMsg("")

                        customCallback()
                    }
                })()
            }
        }}
    >
        {label || "Update payment method"}
    </StoreButton>
}

const Payment = props => {
    return (
        <>
            <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                <InputField required={true} type="password" label="Card number" userData={props.cardData || {}} setUserData={props.setCardData} />
                <InputField required={true} label="Card holder" userData={props.cardData || {}} setUserData={props.setCardData} />
            </ResponsiveRow>
            <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                <InputField required={true} label="Expiration date" userData={props.cardData || {}} setUserData={props.setCardData} />
                <InputField required={true} type="password" label="CVC" userData={props.cardData || {}} setUserData={props.setCardData} />
            </ResponsiveRow>
        </>
    )
}

export { Payment as default, UpdatePaymentMethodButton }