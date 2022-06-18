import React from "react"
import { Link } from "react-router-dom"

const NotFoundPage = props => {
    return (
        <div style={{padding: 40}}>
            <h2>Page not found - 404 error</h2>
            <p>The page you are looking for does not exist.</p>
            <Link className="goHome" to="/">
                Go back to the home page
            </Link>
        </div>
    )
}

export default NotFoundPage