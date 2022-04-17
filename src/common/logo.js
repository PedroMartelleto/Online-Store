import React from "react"
import bookstoreIcon from "./bookstore-icon.svg"

const Logo = props => {
    return (
        <img src={bookstoreIcon} alt="book store icon" {...props} />
    )
}

export default Logo