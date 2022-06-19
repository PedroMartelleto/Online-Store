import React, { useContext, useEffect, useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import { StarRating } from "../products/productCard"
import StoreButton from "../common/storeButton"
import ResponsiveRow from "../common/responsiveRow"
import Select from "react-select"
import update from "immutability-helper"
import LoadingScreen from "../common/loadingScreen"
import API, { AuthContext } from "../api"
import { Navigate } from "react-router"
import { ROUTES } from "../App"
import { Icon } from "@iconify/react"

const cx = classNames.bind(styles)

const unitOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
];

const ProductSummary = props => {
    const prod = props.product
    
    return (
        <ResponsiveRow>
            <div className={cx("prodImgContainer")}>
                <img className={cx("prodImg")} src={prod.coverLink} alt="Book cover" />
            </div>
            <div className={cx("prodDetails")}>
                <div className={cx("prodTopCont")}>
                    <div>
                        <h5 className={cx("prodTitle")} style={{ fontWeight: 500 }}>{prod.title}</h5>
                        <div>{prod.author}</div>
                    </div>
                    <button onClick={event => {
                        const cartWithoutThisItem = props.cart.filter(item => item.productId !== prod._id)
                        API.setCart(cartWithoutThisItem)
                        props.setCart(cartWithoutThisItem)
                    }} variant="buy" className={cx("remove")}>
                        <Icon icon="mdi:close" width={24} />
                    </button>
                </div>
                <div className={cx("starRatingCont")}>
                    <StarRating star={prod.averageRating} />
                    <div className={cx("productCardTail")}>
                        <h4 style={{ fontWeight: 600 }}>
                            {prod.price + " USD"}
                        </h4>
                        {/* Number of units select */}
                        <div>
                            <Select
                                defaultValue={{ value: 1, label: "1" }}
                                isMulti={false}
                                isSearchable={true}
                                options={unitOptions}
                                onChange={newValue => {
                                    props.setCart(update(props.cart, {
                                        [props.index]: { quantity: {
                                            $set: newValue.value
                                         }}
                                    }))
                                }}
                                className={cx("unitSelect")}
                            />
                            <span>
                                Units
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ResponsiveRow>
    )
}

const CartPage = props => {
    const [ isLoading, setIsLoading ] = useState(true)
    const { isAdmin, authToken } = useContext(AuthContext)
    const [ cart, setCart ] = useState([])
    
    // Runs once. GETs the cart for the authenticated user.
    useEffect(() => {
        if (isAdmin) {
            return
        }

        (async () => {
            const cart = await API.getCart(authToken._id)

            if (cart != null) {
                setCart(cart)
            }

            setIsLoading(false)
        })()
    }, [authToken._id, isAdmin])

    // Admins have no cart
    if (isAdmin) {
        return <Navigate to={ROUTES.home} />
    }

    // Returns LoadingScreen while waiting for server response
    if (isLoading) {
        return <LoadingScreen />
    }

    // Computes subtotal
    let subtotal = 0

    for (let i = 0; i < cart.length; i++) {
        subtotal += (cart[i] != null ? (cart[i].product.price * parseFloat(cart[i].quantity)) : 0)
    }

    if (Number.isNaN(subtotal)) {
        subtotal = 0
    }

    // Simulates shipping
    const promo = 30
    const fixedShipping = 2.99
    const shipping = subtotal >= promo ? 0 : fixedShipping

    // Shipping date is hardcoded
    const today = new Date(new Date().getTime()+(5*24*60*60*1000));
    const monthName = today.toLocaleString('default', { month: 'long' });

    return (
        <>
            <NavbarContainer />
            <div className={cx("cartPage")}>
                <div className={cx("cartContainer")}>
                    <h3>
                        Order summary
                    </h3>
                    <div className="caption">
                        Pricing can change depending on shipping method and taxes of your state.<br/>
                        Free shipping for purchases above {promo} USD.
                    </div>
                    {
                        cart == null || cart.length <= 0 ?
                        <h6>
                            Your cart is empty.
                        </h6>
                        : null
                    }
                    {
                        cart != null ? cart.map((prod, index) => {
                            return (
                                <ProductSummary
                                    key={"prod-" + prod + "-" + index}
                                    index={index}
                                    product={prod.product}
                                    quantity={prod.quantity}
                                    setCart={setCart}
                                    cart={cart}
                                    userId={authToken._id}
                                />
                            )
                        }) : null
                    }
                    <div className={cx("resultRow")}>
                        <h5>Subtotal</h5>
                        <h5>{subtotal.toFixed(2)} USD</h5>
                    </div>
                    <div className={cx("resultRow")}>
                        <h5>Shipping</h5>
                        <h5>{subtotal >= promo ? <span className={cx("freeShipping")}>{fixedShipping.toFixed(2) + " USD"}</span> : null} {shipping.toFixed(2)} USD</h5>
                    </div>
                    <div className={cx("resultRow")}>
                        <div className={cx("total")}>
                            <h5>Total Order</h5>
                            <h6 className={cx("delivery")}>Delivery day: {monthName} {today.getDay()}, {today.getFullYear()}</h6>
                        </div>
                        <h3>{(shipping + subtotal).toFixed(2)} USD</h3>
                    </div>
                </div>
                <StoreButton disabled={cart.length <= 0} className={{ [cx("completeOrderBtn")]: true }} variant="buy">
                    Complete order
                </StoreButton>
            </div>
        </>
    )
}

export default CartPage