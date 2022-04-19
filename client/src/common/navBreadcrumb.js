import React from "react"

import styles from "./navbar.module.scss"
import classNames from "classnames/bind"
import { Link } from "react-router-dom"
const cx = classNames.bind(styles)

const NavBreadcrumb = props => {
    return (
        <div className={cx("breadcrumb")}>
            {props.path.map((item, index) => {
                return (
                    <Link key={item.name} to={item.link} className={cx({
                        "breadItem": true,
                        "breadItemActive": index === props.path.length - 1
                    })}>
                        {item.name}
                        {index+1 < props.path.length ? " / " : null}
                    </Link>
                )
                })}
        </div>
    )
}

export default NavBreadcrumb