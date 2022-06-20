import React, { useContext, useEffect, useState } from "react"
import CategoriesText from "../common/categoriesText"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import ProductCard from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
import NavbarContainer from "../common/navbarContainer"
import StoreButton, { RightArrow } from "../common/storeButton"
import API, { AuthContext } from "../api"
import { ROUTES } from "../App"
import genresSortedByVoteCount from "../genresSortedByVoteCount.json"

const cx = classNames.bind(styles)

const HomePage = props => {
    const { isAdmin, authToken, authenticated } = useContext(AuthContext)
    const [ products, setProducts ] = useState([])
    const numProductsToShow = 12

    useEffect(() => {
        (async () => {
            const prods = await API.getProductsBatch(null, numProductsToShow, 0, null, null)
            setProducts(prods)
        })()
    }, [])

    return (
        <>
            <NavbarContainer />
            <div className={cx("homePage")}>
                <div className={cx("titleCont")}>
                    <h3>
                        {!authenticated || authToken == null || authToken.firstName == null ? "Welcome!" : "Welcome, " + authToken.firstName + "!"}
                    </h3>
                    {isAdmin ? 
                        <StoreButton variant="filled" onMouseDown={event => window.location.href = ROUTES.newProduct} >
                            {"Add a New Book "}<RightArrow color="white" />
                        </StoreButton>
                    : undefined}
                    </div>
                    <div className={cx("leftMenu")}>
                        <div className={cx("leftMenuLeft")}>
                            <CategoriesText
                                noPadding={true}
                                title="More Categories"
                                links={genresSortedByVoteCount.genresSortedByVoteCount.slice(10, 32)}
                            />
                        </div>
                        <ResponsiveRow classNames={{[cx("leftAligned")]: true}}>
                            {products != null ? products.slice(0, numProductsToShow).map(prod => <ProductCard
                                border={false}
                                product={prod}
                                key={prod._id}
                            />) : null}
                        </ResponsiveRow>
                    </div>
            </div>
        </>
    )
}

export default HomePage