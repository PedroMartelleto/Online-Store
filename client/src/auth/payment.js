import React from "react"
import ResponsiveRow from "../common/responsiveRow"
import InputField from "./inputField"
import classNames from "classnames/bind"
import styles from "./index.module.scss"

const cx = classNames.bind(styles)

const Payment = props => {
    return (
        <>
            <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                <InputField type="password" label="Card number" userData={props.cardData} setUserData={props.setCardData} />
                <InputField label="Card holder" userData={props.cardData} setUserData={props.setCardData} />
            </ResponsiveRow>
            <ResponsiveRow classNames={{ [cx("rowCompact")]: true }}>
                <InputField label="Expiration date" userData={props.cardData} setUserData={props.setCardData} />
                <InputField type="password" label="CVC" userData={props.cardData} setUserData={props.setCardData} />
            </ResponsiveRow>
        </>
    )
}

export default Payment