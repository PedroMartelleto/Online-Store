const { default: mongoose } = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        // Basic info
        _id: { type: mongoose.Types.ObjectId, required: true, unique: true },
        title: { type: String, required: true },
        link: { type: String, required: false },
        series: { type: String, required: false },
        coverLink: { type: String, required: false },
        author: { type: String, required: true },
        authorLink: { type: String, required: false },
        price: { type: Number, required: false },
        quantity: { type: Number, required: false },
        // Rating and reviews
        ratingCount: { type: Number, required: true },
        reviewCount: { type: Number, required: true },
        averageRating: { type: Number, required: true },
        fiveStarRatings: { type: Number, required: true },
        fourStarRatings: { type: Number, required: true },
        threeStarRatings: { type: Number, required: true },
        twoStarRatings: { type: Number, required: true },
        oneStarRatings: { type: Number, required: true },
        // Details
        numberOfPages: { type: Number, required: false },
        datePublished: { type: Date, required: false },
        publisher: { type: String, required: false },
        originalTitle: { type: String, required: false },
        genres: { type: String, required: false },
        // Other types of ID
        isbn: { type: String, required: false },
        isbn13: { type: String, required: false },
        asin: { type: String, required: false },
        // More detailed information
        settings: { type: String, required: false },
        characters: { type: String, required: false },
        awards: { type: String, required: false },
        amazonRedirectLink: { type: String, required: false },
        worldcatRedirectLink: { type: String, required: false },
        booksInSeries: { type: String, required: false },
        description: { type: String, required: false },
        // Recommendations
        recommendedBooks: { type: String, required: false }
    },
    { _id: false, timestamps: true }
)

const UserSchema = new mongoose.Schema(
    {
        // Basic info
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
    }
)

const CartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, required: true, unique: true },
        products: [
            {
                productId: { type: String },
                quantity: { type: Number, default: 1 }
            }
        ]
    },
    { timestamps: true }
)

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, required: true, unique: true },
        products: [
            {
                productId: { type: String },
                quantity: { type: Number, default: 1 }
            }
        ],
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
    },
    { timestamps: true }
)

const User = mongoose.model("User", UserSchema)
const Cart = mongoose.model("Cart", CartSchema)
const Order = mongoose.model("Order", OrderSchema)
const Product = mongoose.model("Product", ProductSchema)

module.exports = { User, Cart, Order, Product }