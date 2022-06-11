import React from "react"

import styles from "./navbar.module.scss"
import classNames from "classnames/bind"
import { Link } from "react-router-dom"
const cx = classNames.bind(styles)

// NOTE: This is a temporary solution to get the breadcrumb path
const products = {
	"1236557": "The Way of Kings"
}

function createBreadcrumbPath() {
	const url = new URL(window.location.href)
	let link = ""
	const breadcrumb = []
	
	let pathname = url.pathname
	if (pathname.endsWith("/")) {
		pathname = pathname.substring(0, pathname.length - 1)
	}

	for (const path of pathname.split("/")) {
		let name = path.charAt(0).toUpperCase() + path.slice(1)

		if (!Number.isNaN(Number(path))) {
			name = products[String(path)]
		}

		if (path == null || path.length <= 0) {
			name = "Homepage"
		}

		for (let i = name.length - 1; i >= 1; --i) {
			if (name.charAt(i) === name.charAt(i).toUpperCase()) {
				name = name.substring(0, i) + " " + name.substring(i)
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

const NavBreadcrumb = props => {
    const path = createBreadcrumbPath()

	return (
        <div className={cx("breadcrumb")}>
            {path.map((item, index) => {
                return (
                    <Link key={item.name + "_" + index} to={item.link} className={cx({
                        "breadItem": true,
                        "breadItemActive": index === path.length - 1
                    })}>
                        {item.name + (index+1 < path.length ? " > " : "")}
                    </Link>
                )
                })}
        </div>
    )
}

export default NavBreadcrumb