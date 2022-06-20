import { InlineIcon } from "@iconify/react"
import React, { useContext } from "react"
import StoreButton from "../common/storeButton"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import API, { AdminAPI, AuthContext } from "../api"
import { useNavigate } from "react-router"
import { ROUTES } from "../App"
import genresSortedByVoteCount from "../genresSortedByVoteCount.json"
const cx = classNames.bind(styles)

function findInCart(cartSummary, prodId) {
    if (cartSummary == null) return -1

    for (let i = 0; i < cartSummary.length; ++i) {
        if (String(cartSummary[i].productId) === String(prodId)) {
            return i
        }
    }
    return -1
}

const PrimaryDetailButton = ({ prod, cartSummary, setCartSummary, isAdmin, isNewProduct, navigate }) => {
    let storeButtonContents = null
    
    let indexInCart = prod == null ? -1 : findInCart(cartSummary, prod._id)

    if (!isAdmin) {
        // If the item is in the cart, the button should say "Remove from cart"
        if (indexInCart < 0) {
            storeButtonContents = (<div className={cx("addToCart")}>
                <InlineIcon className={cx("plus")} icon="mdi:plus" width={22} />
                <span>Add to cart</span>
            </div>)
        }
        else {
            storeButtonContents = (<div className={cx("addToCart")}>
                <InlineIcon className={cx("plus")} icon="mdi:minus" width={22} />
                <span>Remove from cart</span>
            </div>)
        }
    }
    else {
        // If the product is new, we are creating a new product, so the button should say "Create product"
        if (isNewProduct) {
            storeButtonContents = "Create new product"
        }
        else {
            storeButtonContents = "Confirm changes"
        }
    }

    return (
        <StoreButton
            variant="buy"
            disabled={prod == null || (!isAdmin && prod.quantity <= 0)}
            onMouseDown={event => {
                // OnMouseDown in "Confirm Changes" / "Add To Cart" / "Create new Product"
                (async() => {
                    if (!isAdmin) {
                        if (prod.quantity <= 0) return

                        // If not admin, we are adding a product to the cart
                        if (cartSummary == null) {
                            console.warn("Cart summary should never be null at this point.")
                            return
                        }

                        indexInCart = findInCart(cartSummary, prod._id)
                        
                        if (indexInCart < 0) {
                            const newSummary = await API.addProductToCart(prod._id)
                            if (newSummary != null) setCartSummary(newSummary)
                        }
                        else {
                            const newSummary = await API.removeProductFromCart(prod._id)
                            if (newSummary != null) setCartSummary(newSummary)
                        }
                    }
                    else {
                        // If we are admin, we editing the product's information
                        const confirmation = isNewProduct ? window.confirm("Are you sure you want to create this new product?") : window.confirm("Are you sure you want to edit this product?")

                        const getValue = fieldName => {
                            return document.getElementsByClassName(cx(fieldName))[0].innerText
                        }

                        if (confirmation) {
                            const merge = {
                                title: getValue("titleH1"),
                                series: getValue("seriesH3"),
                                author: getValue("author"),
                                description: getValue("description"),
                                publisher: getValue("publisher"),
                                datePublished: getValue("datePublished"),
                                numberOfPages: getValue("numberOfPages"),
                                price: getValue("priceH2"),
                                quantity: getValue("quantity"),
                                coverLink: document.getElementsByClassName(cx("prodDetailImg"))[0].src
                            }

                            if (!isNewProduct) {
                                await AdminAPI.editProduct(prod._id, merge)
                                window.alert(`Product ${prod.title} successfully updated.`)
                            }
                            else {
                                const genre = window.prompt("Please enter a valid genre for this product:")

                                if (!genre || !genre.length || !genresSortedByVoteCount.genresSortedByVoteCount.includes(genre)) {
                                    window.alert("Invalid genre, cancelling operation.")
                                    return
                                }

                                merge.genres = [ genre ]

                                if (await AdminAPI.createProduct(merge) != null) {
                                    window.alert(`Product ${merge.title} successfully created.`)
                                    navigate(ROUTES.home)
                                }
                            }
                        }
                    }
                })()
            }}>
            {storeButtonContents}
        </StoreButton>
    )
}

const ProductInfo = props => {
    const prod = props.product
    const { isAdmin, cartSummary, setCartSummary } = useContext(AuthContext)
    const navigate = useNavigate()
    const isNewProduct = prod._id === "new"

    return (
        <div className={cx("prodInfo")}>
            <div className={cx("infoCont")}>
                <div className={cx("infoLabel")}>
                    <p>Publisher:</p>
                    <p>Date published:</p>
                    <p>Review count:</p>
                    <p>Page count:</p>
                    <p>Quantity:</p>
                </div>
                <div className={cx("infoValue")}>
                    <p className={cx("publisher")} contentEditable={isAdmin} suppressContentEditableWarning={true}>{prod.publisher}</p>
                    <p className={cx("datePublished")} contentEditable={isAdmin} suppressContentEditableWarning={true}>{prod.datePublished}</p>
                    <p>{prod.reviewCount}</p>
                    <p className={cx("numberOfPages")} contentEditable={isAdmin} suppressContentEditableWarning={true}>{prod.numberOfPages}</p>
                    <p className={cx("quantity")} contentEditable={isAdmin} suppressContentEditableWarning={true}>{prod.quantity}</p>
                </div>
            </div>
            <div className={cx("price")}>
                <div className={cx("actions")}>
                    <h2 className={cx("priceH2")} contentEditable={isAdmin} suppressContentEditableWarning={true}>
                        {prod.price}
                    </h2>
                    <h2>
                        {"USD"}
                    </h2>
                </div>
                <div className={cx("actions")}>
                    <PrimaryDetailButton
                        navigate={navigate}
                        prod={prod}
                        cartSummary={cartSummary}
                        setCartSummary={setCartSummary}
                        isAdmin={isAdmin}
                        isNewProduct={isNewProduct}
                    />
                    {isAdmin ?
                        <StoreButton
                            className={{[cx("archiveBtn")]: true}}
                            variant="buy"
                            onMouseDown={event => {
                                if (isNewProduct) {
                                    navigate(ROUTES.home)
                                    return
                                }

                                const confirmation = window.confirm(`Are you sure you want to remove this product (${prod.title})?`)

                                if (confirmation) {
                                    AdminAPI.deleteProduct(prod._id).then(() => {
                                        window.alert(`Product ${prod.title} deleted.`)
                                        navigate(ROUTES.home)
                                    })
                                }
                            }}
                        >
                            {!isNewProduct ? "Delete product" : "Go back"}
                        </StoreButton>
                    : null}
                </div>
            </div>
        </div>
    )
}

export default ProductInfo