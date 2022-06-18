import React from "react"
import { StarRating } from "./productCard"
import { getTrackBackground, Range } from "react-range"
import classNames from "classnames/bind"
import styles from "./index.module.scss"

const cx = classNames.bind(styles)

const StarsFilter = props => {
    const values = props.values

    return (
        <div className={cx("ratingRange")}>
            <div className={cx("labelsHorizontal")}>
                <div className={cx("rangeLabels")}>
                    <h6>Min</h6>
                    <h6>Max</h6>
                </div>
                <div className={cx("rangeStars")}>
                    <StarRating star={props.values[0]} />
                    <StarRating star={props.values[1]} />
                </div>
            </div>
            <Range
                step={0.25}
                min={0}
                max={5}
                values={values}
                onChange={values => props.setValues(values)}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: "60px",
                            display: "flex",
                            width: "100%",
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: "4px",
                                width: "100%",
                                borderRadius: "4px",
                                background: getTrackBackground({
                                    values,
                                    colors: ["#ccc", "#EE316D", "#ccc"],
                                    min: 0,
                                    max: 5
                                }),
                                alignSelf: "center"
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props, isDragged }) => (
                    <div
                        {...props}
                        className={cx("thumb")}
                        style={{
                            ...props.style,
                            height: "30px",
                            width: "30px",
                            borderRadius: "4px",
                            backgroundColor: "#FFF",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 2px 6px #AAA"
                        }}
                    >
                        <div
                            style={{
                                height: "8px",
                                width: "5px",
                                backgroundColor: isDragged ? "#EE316D" : "#CCC"
                            }}
                        />
                    </div>
                )}
            />
        </div>
    );
}

export default StarsFilter