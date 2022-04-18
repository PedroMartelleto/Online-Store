import React from "react"
import CategoriesText from "../common/categoriesText"
import Navbar from "../common/navbar"
import NavBreadcrumb from "../common/navBreadcrumb"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
import ProductCard, { TestProduct } from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
const cx = classNames.bind(styles)

const HomePage = props => {
    return <div className={cx("container")}>
        <Navbar />
        <NavBreadcrumb path={[
            { name: "Homepage", link: "/" },
        ]} />
        <ResponsiveRow>
            <CategoriesText
                title="Best-selling products"
                links={["Fiction", "Psychology", "Science", "Science Fiction"]}
                button="Explore"
            />
            <ProductCard
                border={false}
                product={TestProduct}
            />
            <ProductCard
                border={false}
                product={TestProduct}
            />
            <ProductCard
                border={false}
                product={TestProduct}
            />
        </ResponsiveRow>
    </div>
}

export default HomePage