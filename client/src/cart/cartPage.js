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
import { Navigate, useNavigate } from "react-router"
import { ROUTES } from "../App"
import { Icon } from "@iconify/react"
import Payment, { UpdatePaymentMethodButton } from "../auth/payment"

const cx = classNames.bind(styles)


const ProductSummary = props => {
    const prod = props.product
    const { cartSummary, setCartSummary } = useContext(AuthContext)

    const unitOptions = [
        { value: 1, label: '1' }
    ]

    for (let i = 2; i <= Math.min(prod.quantity, 10); ++i) {
        unitOptions.push({ value: i, label: i.toString() })
    }

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

                        const cartSummaryWithoutThisItem = cartSummary.filter(item => item.productId !== prod._id)
                        setCartSummary(cartSummaryWithoutThisItem)
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
                                    const newCartData = update(props.cart, {
                                        [props.index]: { quantity: {
                                            $set: newValue.value
                                         }}
                                    })
                                    props.setCart(newCartData)
                                    // Updates quantity in cart (API)
                                    API.setCart(newCartData) 
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
    const { isAdmin, authToken, setCartSummary } = useContext(AuthContext)
    const [ cart, setCart ] = useState([])
    const [ errorMsg, setErrorMsg ] = useState("")
    const [ cardData, setCardData ] = useState(null)
    const [ isInvalidCard, setIsInvalidCard ] = useState(true)
    const navigate = useNavigate()
    
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

            const cardData = await API.getCardData(authToken._id)

            if (cardData != null) {
                setCardData(cardData)
                setIsInvalidCard(false)
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

    const purchase = async () => {
        const result = await API.makeOrder()
        if (result == null) {
            setErrorMsg("Failed to make purchase. Either your payment information is invalid or one or more items are out of stock.")
        }
        else {
            setCartSummary([])
            navigate(ROUTES.orderComplete)
        }
    }

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
                {isInvalidCard ? (
                    <div className={cx("paymentContainer")}>
                        <h3 className={cx("paymentTitle")}>
                            Payment method
                        </h3>
                        <div className="caption">
                            Please enter your payment method
                        </div>
                        <Payment cardData={cardData || {}} setCardData={setCardData} />
                        <UpdatePaymentMethodButton
                            disabled={cart.length <= 0}
                            label="Update info and complete roder"
                            customCallback={purchase}
                            cardData={cardData || {}}
                            setCardData={setCardData}
                            setErrorMsg={setErrorMsg}
                        />
                    </div>
                ) : (
                    <StoreButton
                        disabled={cart.length <= 0}
                        className={{ [cx("completeOrderBtn")]: true }}
                        variant="buy"
                        onMouseDown={event => {
                            purchase()
                        }}
                    >
                        Complete order
                    </StoreButton>
                )}
                <div className={cx("validationError")}>
                    {errorMsg}
                </div>
            </div>
        </>
    )
}

export default CartPage