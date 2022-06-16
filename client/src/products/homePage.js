import React, { useContext } from "react"
import CategoriesText from "../common/categoriesText"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import ProductCard, { TestProduct } from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
import NavbarContainer from "../common/navbarContainer"
import StoreButton, { RightArrow } from "../common/storeButton"
import { AuthContext } from "../api"
import { ROUTES } from "../App"
const cx = classNames.bind(styles)

const HomePage = props => {
    const { isAdmin } = useContext(AuthContext)

    return (
        <>
            <NavbarContainer />
            <div className={cx("homePage")}>
                <div className={cx("titleCont")}>
                        <h3>Welcome, Pedro!</h3>
                        {isAdmin ? 
                            <StoreButton variant="filled" onMouseDown={event => window.location.href = ROUTES.newProduct} >
                                {"Add a New Book "}<RightArrow color="white" />
                            </StoreButton>
                        : undefined}
                    </div>
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
        </>
    )
}

export default HomePage