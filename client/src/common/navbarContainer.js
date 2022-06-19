import React from "react"
import NavBreadcrumb from "./navBreadcrumb"
import Navbar from "./navbar"

const NavbarContainer = props => {
    return (
        <>
            <Navbar searchParams={props.searchParams} setSearchParams={props.setSearchParams} />
            <NavBreadcrumb pathName={props.pathName} />
        </>
    )
}

export default NavbarContainer