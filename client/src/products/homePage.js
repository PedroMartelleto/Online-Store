import React from "react"
import CategoriesText from "../common/categoriesText"

//import styles from "./index.module.scss"
//import classNames from "classnames/bind"
import ProductCard, { TestProduct } from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
import NavbarContainer from "../common/navbarContainer"
//const cx = classNames.bind(styles)

const HomePage = props => {
    return (
        <>
            <NavbarContainer />
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
        </>
    )
}

export default HomePage