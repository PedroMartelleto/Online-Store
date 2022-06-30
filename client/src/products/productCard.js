import React, { useContext } from "react"
import styles from "./index.module.scss"
import classNames from "classnames/bind"
import { Icon } from "@iconify/react"
import StoreButton from "../common/storeButton"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../api"
const cx = classNames.bind(styles)

/*
id
title
link
series
cover_link
author
author_link
rating_count
review_count
average_rating
five_star_ratings
four_star_ratings
three_star_ratings
two_star_ratings
one_star_ratings
number_of_pages
date_published
publisher
original_title
genre_and_votes
isbn
isbn13
asin
settings
characters
awards
amazon_redirect_link
worldcat_redirect_link
recommended_books
books_in_series
description
*/

const TestProduct = {
    _id: 1236557,
    title: "The Way of Kings",
    link: "https://www.goodreads.com/book/show/7235533-the-way-of-kings",
    series: "(The Stormlight Archive #1)",
    coverLink: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388184640l/7235533.jpg",
    author: "Brandon Sanderson",
    authorLink: "https://www.goodreads.com/author/show/38550.Brandon_Sanderson",
    ratingCount: 375459,
    reviewCount: 25522,
    averageRating: 4.64,
    numberOfPages: 1007,
    datePublished: "31/08/2010",
    publisher: "Tor Books",
    originalTitle: "The Way of Kings",
    genreAndVotes: "Fantasy 18527, Fiction 2148, Epic Fantasy 1330",
    recommendedBooks: [2109380, 460946],
    booksInSeries: true,
    price: 36.99,
    description: `From #1 New York Times bestselling author Brandon Sanderson, The Way of Kings, book one of The Stormlight Archive begins an incredible new saga of epic proportion.

    Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Animals hide in shells, trees pull in branches, and grass retracts into the soilless ground. Cities are built only where the topography offers shelter.
    
    It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant, but their Shardblades and Shardplate remain: mystical swords and suits of armor that transform ordinary men into near-invincible warriors. Men trade kingdoms for Shardblades. Wars were fought for them, and won by them.
    
    One such war rages on a ruined landscape called the Shattered Plains. There, Kaladin, who traded his medical apprenticeship for a spear to protect his little brother, has been reduced to slavery. In a war that makes no sense, where ten armies fight separately against a single foe, he struggles to save his men and to fathom the leaders who consider them expendable.
    
    Brightlord Dalinar Kholin commands one of those other armies. Like his brother, the late king, he is fascinated by an ancient text called The Way of Kings. Troubled by over-powering visions of ancient times and the Knights Radiant, he has begun to doubt his own sanity.
    
    Across the ocean, an untried young woman named Shallan seeks to train under an eminent scholar and notorious heretic, Dalinar's niece, Jasnah. Though she genuinely loves learning, Shallan's motives are less than pure. As she plans a daring theft, her research for Jasnah hints at secrets of the Knights Radiant and the true cause of the war.
    
    The result of over ten years of planning, writing, and world-building, The Way of Kings is but the opening movement of the Stormlight Archive, a bold masterpiece in the making.
    
    Speak again the ancient oaths:
    
    Life before death.
    Strength before weakness.
    Journey before Destination.
    
    and return to men the Shards they once bore.
    
    The Knights Radiant must stand again.`
}

const StarRating = props => {
    const stars = []
    
    const star = Math.ceil(props.star*2)/2

    for (let i = 0; i < 5; i++) {
        let icon = "bx:star"
    
        if (i+1 <= star) {
            icon = "bxs:star"
        }
        else if (i + 0.5 <= star) {
            icon = "bxs:star-half"
        }

        stars.push(<Icon key={"star_" + i}
                         icon={icon}
                         color="#FDBC15"
                         width={18}
                   />)
    }

    return (
        <div className={cx("starRating")}>
            {stars}
        </div>
    )
}

const ProductCard = props => {
    const prod = props.product
    const { isAdmin } = useContext(AuthContext)
    const navigate = useNavigate()

    return (
        <div className={cx("prodLink")}>
            <div className={cx({
                "productCard": true,
                "cardBorder": props.border
            })}>
                <div className={cx("prodCardImgContainer")}>
                    <img className={cx("productCardImage")} src={prod.coverLink} alt="Book cover" />
                </div>
                <h5 style={{fontWeight: 500}}>{prod.title}</h5>
                <h6>{prod.author}</h6>
                <StarRating star={Math.round(prod.averageRating * 10) / 10} />
                <div className={cx("productCardTail")}>
                    <h5 style={{fontSize: 16, fontWeight: 600}}>
                        {prod.price + " USD"}
                    </h5>
                    <StoreButton className={{[cx("highlightBtn")]: true}} variant="buy" onMouseDown={event => navigate(`/products/${prod._id}`)}>
                        {!isAdmin ? "Buy now" : "Edit"}
                    </StoreButton>
                </div>
            </div>
        </div>
    )
}

export { ProductCard as default, TestProduct, StarRating }