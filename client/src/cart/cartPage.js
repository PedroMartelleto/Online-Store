import React, { useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import NavbarContainer from "../common/navbarContainer"
import { StarRating, TestProduct } from "../products/productCard"
import StoreButton from "../common/storeButton"
import ResponsiveRow from "../common/responsiveRow"
import Select from "react-select"
import update from "immutability-helper"

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
                <h5 style={{ fontWeight: 500 }}>{prod.title}</h5>
                <div>{prod.author}</div>
                <StarRating star={prod.averageRating} />
                <div className={cx("productCardTail")}>
                    <h4 style={{ fontWeight: 600 }}>
                        {prod.price + " USD"}
                    </h4>
                    {/* Number of units select */}
                    <div>
                        <Select
                            defaultValue={{value: props.quantity, label: props.quantity}}
                            isMulti={false}
                            isSearchable={true}
                            options={unitOptions}
                            onChange={newValue => props.setQuantities(update(props.quantities, { [props.index]: { $set: newValue.value } }))}
                            className={cx("unitSelect")}
                        />
                        <span>
                            Units
                        </span>
                    </div>
                </div>
            </div>
        </ResponsiveRow>
    )
}

const CartPage = props => {
    const products = props.products || [TestProduct, TestProduct, TestProduct]
    const [quantities, setQuantities] = useState(products.map(prod => 1))

    let subtotal = 0

    for (let i = 0; i < products.length; i++) {
        subtotal += products[i].price * Number(quantities[i])
    }

    const shipping = subtotal <= 15 ? 0 : 2.99

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
                        Pricing can change depending on shipping method and taxes of your state.
                    </div>
                    {
                        products.map((prod, index) => {
                            return (
                                <ProductSummary
                                    key={"prod-" + prod.id + "-" + index}
                                    index={index}
                                    product={prod}
                                    quantity={quantities[index]}
                                    quantities={quantities}
                                    setQuantities={setQuantities}
                                />
                            )
                        })
                    }
                    <div className={cx("resultRow")}>
                        <h5>Subtotal</h5>
                        <h5>{subtotal.toFixed(2)} USD</h5>
                    </div>
                    <div className={cx("resultRow")}>
                        <h5>Shipping</h5>
                        <h5>{shipping.toFixed(2)} USD</h5>
                    </div>
                    <div className={cx("resultRow")}>
                        <div className={cx("total")}>
                            <h5>Total Order</h5>
                            <h6 className={cx("delivery")}>Delivery day: {monthName} {today.getDay()}, {today.getFullYear()}</h6>
                        </div>
                        <h3>{(shipping + subtotal).toFixed(2)} USD</h3>
                    </div>
                </div>
                <StoreButton className={{ [cx("completeOrderBtn")]: true }} variant="buy">
                    Complete order
                </StoreButton>
            </div>
        </>
    )
}

export default CartPage