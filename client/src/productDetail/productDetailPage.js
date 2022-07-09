import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import ResponsiveRow from "../common/responsiveRow"
import StoreButton, { RightArrow } from "../common/storeButton"
import NotFoundPage from "../notFound/notFoundPage"
import ProductCard, { StarRating } from "../products/productCard"
import ProductInfo from "./productInfo"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import { Link } from "react-router-dom"
import NavbarContainer from "../common/navbarContainer"
import API, { AuthContext } from "../api"
import LoadingScreen from "../common/loadingScreen"
const cx = classNames.bind(styles)

const NewProduct = Object.freeze({
    _id: "new",
    title: "Title",
    link: "",
    series: "Series",
    coverLink: "",
    author: "Author",
    authorLink: "",
    price: "5.99",
    quantity: "5",
    // Rating and reviews
    ratingCount: 0,
    reviewCount: 0,
    averageRating: 2.5,
    fiveStarRatings: 0,
    fourStarRatings: 0,
    threeStarRatings: 0,
    twoStarRatings: 0,
    oneStarRatings: 0,
    // Details
    numberOfPages: 100,
    datePublished: "January 1st 1990",
    publisher: "Publisher",
    originalTitle: "Original Title",
    genres: ["Fiction"],
    votes: [0],
    // Other types of ID
    isbn: -1,
    isbn13: -1,
    asin: -1,
    // More detailed information
    settings: "Settings",
    characters: "Characters",
    awards: "Awards",
    amazonRedirectLink: "",
    worldcatRedirectLink: "",
    booksInSeries: true,
    description: "Description",
    // Recommendations
    recommendedBooks: [""]
})

const ReadMoreText = ({ text, maxCharCount, ...otherProps }) => {
    const [ isExpanded, setIsExpanded ] = useState(false)

    const handleClick = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <p {...otherProps}>
            {text.length > maxCharCount ? (
                <>
                    {isExpanded ? text : text.substring(0, maxCharCount) + "..."}
                    <button className={cx("readMoreButton")} onClick={handleClick}>
                        {isExpanded ? "Read Less" : "Read More"}
                    </button>
                </>
            ) : (
                <>
                    {text}
                </>
            )}
        </p>
    )
}

const ProductDetailPage = props => {
    const params = useParams()
    const { isAdmin } = useContext(AuthContext)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ product, setProduct ] = useState(null)
    const prod = product
    const [ recommendations, setRecommendations ] = useState([])
    const { _id: prodId } = useParams()
    const [ coverLink, setCoverLink ] = useState(prod == null ? "" : prod.coverLink)

    useEffect(() => {
        (async () => {
            if (!isAdmin && prodId === "new") {
                // 404
                setProduct(null)
                setIsLoading(false)
            }
            else if (prodId === "new") {
                // Admin is creating a new product
                setProduct(Object.assign({}, NewProduct))
                setIsLoading(false)
            }
            else { // Not a new product
                const details = await API.getProduct(prodId)
                
                if (details.recommendedBooks != null) {
                    let recommended = Array.from(new Set(details.recommendedBooks.split(",").map(r => r.trim())))

                    if (recommended.length > 8) {
                        recommended = recommended.slice(0, 8)
                    }

                    const recProducts = []

                    for (const recId of recommended) {
                        const prod = await API.getProduct(recId.trim())
                        if (prod != null) {
                            recProducts.push(prod)
                        }
                    }

                    setRecommendations(recProducts)
                }

                setProduct(details)
                setCoverLink(details.coverLink)
                setIsLoading(false)
            }
        })()
    }, [ prodId, isAdmin ])

    if (!params._id || (params._id === "new" && !isAdmin)) {
        return <NotFoundPage />
    }

    return (
        <div>
            <NavbarContainer pathName={prod == null ? null : prod.title} />
            {!isLoading ? <>
                <div className={cx("detailContainer")}>
                    <div className={cx("detailText")}>
                        <div className={cx("title")}>
                            <h1 className={cx("titleH1")} contentEditable={isAdmin} suppressContentEditableWarning={true}> {prod.title}</h1>
                            {prod.series ? <h3 className={cx("seriesH3")} contentEditable={isAdmin} suppressContentEditableWarning={true}>{prod.series}</h3> : undefined}
                            <h5>by <a className={cx("author")} contentEditable={isAdmin} suppressContentEditableWarning={true} href={prod.authorLink} target="_blank" rel="noreferrer"> {prod.author} </a></h5>
                            <div className={cx("detailRating")}>
                                <StarRating star={prod.averageRating} />
                                <span>({prod.reviewCount} customer reviews)</span>
                            </div>
                        </div>
                        {isAdmin ? (
                            <p className={cx("description")} contentEditable={isAdmin} suppressContentEditableWarning={true}>
                                {prod.description}
                            </p>
                        ) : (
                            <ReadMoreText text={prod.description}
                                maxCharCount={460}
                                className={cx("description", "descrWithReadMore")}
                            />
                        )}
                        <ProductInfo product={prod} />
                    </div>
                    <div className={cx({"prodDetailImgCont": true, "prodDetailImgContAdmin": isAdmin})}>
                        <img className={cx("prodDetailImg")} src={coverLink} alt="Book cover" />
                        {isAdmin ? 
                        <StoreButton className={{[cx("prodDetailsSetImgURL")]: true}} variant="buy" onMouseDown={event => setCoverLink(window.prompt("Please enter a valid image URL:"))}>
                            Set image URL
                        </StoreButton> : null}
                    </div>
                </div>
                <div className={cx("detailRec")}>
                    <h4>Related products</h4>
                    <Link to="/products" className={cx("detailMoreBtn")}>
                        <StoreButton>
                            {"More products "}
                            <RightArrow />
                        </StoreButton>
                    </Link>
                </div>
                <ResponsiveRow classNames={{[cx("leftAligned")]: true}}>
                    {recommendations.map(prod => <ProductCard
                        key={prod._id}
                        border={false}
                        product={prod}
                    />)}
                </ResponsiveRow>
            </> : <LoadingScreen />}
        </div>
    )
}

export default ProductDetailPage