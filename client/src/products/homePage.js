import React, { useContext, useEffect, useState } from "react"
import CategoriesText from "../common/categoriesText"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import ProductCard from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
import NavbarContainer from "../common/navbarContainer"
import StoreButton, { RightArrow } from "../common/storeButton"
import Api, { AuthContext } from "../api"
import { ROUTES } from "../App"
const cx = classNames.bind(styles)

const HomePage = props => {
    const { isAdmin, authToken } = useContext(AuthContext)
    const [ products, setProducts ] = useState([])

    useEffect(() => {
        (async () => {
            const prod = await Api.getProductsBatch(null, null, 9, 0, null)
            console.log(prod)
            setProducts(prod)
        })()
    }, [])

    const numProductsToShow = Math.min(Math.floor(products.length / 4) * 4 - 1, products.length)

    return (
        <>
            <NavbarContainer />
            <div className={cx("homePage")}>
                <div className={cx("titleCont")}>
                        <h3>
                            {authToken == null ? "Welcome!" : "Welcome, " + authToken.firstName + "!"}
                        </h3>
                        {isAdmin ? 
                            <StoreButton variant="filled" onMouseDown={event => window.location.href = ROUTES.newProduct} >
                                {"Add a New Book "}<RightArrow color="white" />
                            </StoreButton>
                        : undefined}
                    </div>
                <ResponsiveRow classNames={{[cx("leftAligned")]: true}}>
                    <CategoriesText
                        title="Best-selling products"
                        links={["Fiction", "Psychology", "Science", "Science Fiction"]}
                        button="Explore"
                    />
                    {products != null ? products.slice(0, numProductsToShow).map(prod => <ProductCard
                        border={false}
                        product={prod}
                        key={prod._id}
                    />) : null}
                </ResponsiveRow>
            </div>
        </>
    )
}

export default HomePage