import React from "react"

import styles from "./navbar.module.scss"
import classNames from "classnames/bind"
import { Link, useLocation } from "react-router-dom"
const cx = classNames.bind(styles)

// NOTE: This is a temporary solution to get the breadcrumb path

function createBreadcrumbPath(location) {
	let link = ""
	const breadcrumb = []
	
	let pathname = location.pathname
	if (pathname.endsWith("/")) {
		pathname = pathname.substring(0, pathname.length - 1)
	}

	for (const path of pathname.split("/")) {
		let name = path.charAt(0).toUpperCase() + path.slice(1)

		if (!Number.isNaN(Number(path))) {
			name = "$$toBeDefined$$"
		}

		if (path == null || path.length <= 0) {
			name = "Homepage"
		}

		if (name !== "$$toBeDefined$$") {
			for (let i = name.length - 1; i >= 1; --i) {
				if (name.charAt(i) === name.charAt(i).toUpperCase()) {
					name = name.substring(0, i) + " " + name.substring(i)
				}
			}
		}

		link += path + "/"
		
		if (name != null && name.length > 0) {
			breadcrumb.push({
				name,
				link
			})
		}
	}

	return breadcrumb
}

function getItemName(item, props, index, path) {
	if (item.name === "$$toBeDefined$$") {
		if (props.pathName) return props.pathName
		else return ""
	}

	return item.name + (index+1 < path.length ? " > " : "")
}

const NavBreadcrumb = props => {
	const location = useLocation()
    const path = createBreadcrumbPath(location)

	return (
        <div className={cx("breadcrumb")}>
            {path.map((item, index) => {
                return (
                    <Link key={item.name + "_" + index} to={item.link} className={cx({
                        "breadItem": true,
                        "breadItemActive": index === path.length - 1
                    })}>
                        {getItemName(item, props, index, path)}
                    </Link>
                )
                })}
        </div>
    )
}

export default NavBreadcrumb