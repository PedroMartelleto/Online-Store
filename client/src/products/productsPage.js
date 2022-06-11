import React, { useState } from "react"

import styles from "./index.module.scss"
import classNames from "classnames/bind"
import ProductCard, { StarRating, TestProduct } from "./productCard"
import ResponsiveRow from "../common/responsiveRow"
import CategoriesText from "../common/categoriesText"
import NavbarContainer from "../common/navbarContainer"
import StoreButton, { RightArrow } from "../common/storeButton"
const cx = classNames.bind(styles)

// MARK: - Functions used to keep track of the stars filters
const onChangeStarsCheckbox = (event, starsAllowed, setStarsAllowed, stars) => {
    const newSet = new Set(starsAllowed)
    
    if (event.target.checked) {
        newSet.add(stars)
    } else {
        newSet.delete(stars)
    }

    setStarsAllowed(newSet)
}

const StarsCheckbox = props => {
    return (
        <div className={cx("stars")}>
            <input className="form-check-input"
                type="checkbox"
                value="" id="flexCheckChecked"
                checked={props.starsAllowed.has(props.stars)}
                onChange={event => onChangeStarsCheckbox(event, props.starsAllowed, props.setStarsAllowed, props.stars)} />
            <label className="form-check-label" htmlFor="flexCheckChecked" />
            <StarRating star={props.stars} />
        </div>
    )
}

// MARK: - Main product page
const ProductsPage = props => {
    const [ starsAllowed, setStarsAllowed ] = useState(new Set([1, 2, 3, 4, 5]))
    const filters = []
    const isAdmin = true // props.isAdmin

    return (
        <>
            <NavbarContainer />
            <div className={cx("prodCont")}>
                <div className={cx("titleCont")}>
                    <h1>Fiction</h1>
                    {isAdmin ? 
                        <StoreButton variant="filled" onMouseDown={event => window.location.href = "/products/new"} >
                            {"Add a New Book "}<RightArrow color="white" />
                        </StoreButton>
                    : undefined}
                </div>
                {!!filters && filters.length > 0 ? (
                <div>
                    <h6>Applied filters:</h6>
                </div>) : undefined}
                    <div className={cx("leftMenu")}>
                        <div className={cx("leftMenuLeft")}>
                            <CategoriesText
                                noPadding={true}
                                title="Categories"
                                links={["Fiction", "Psychology", "Science", "Science Fiction"]}
                            />
                            <div className={cx("rating")}>
                                <h4>Rating</h4>
                                {[5,4,3,2,1].map(stars => {
                                    return <StarsCheckbox key={"star_" + stars}
                                                        stars={stars}
                                                        starsAllowed={starsAllowed}
                                                        setStarsAllowed={setStarsAllowed}
                                            />
                                })}
                            </div>
                        </div>
                        <ResponsiveRow>
                            <ProductCard
                                border={true}
                                product={TestProduct}
                            />
                            <ProductCard
                                border={true}
                                product={TestProduct}
                            />
                            <ProductCard
                                border={true}
                                product={TestProduct}
                            />
                            
                        </ResponsiveRow>
                    </div>
            </div>
        </>
    )
}

export default ProductsPage