const { Product } = require('../dataModel')
const router = require('express').Router()
const { authorizeToken } = require('../tokenAuth')

// POST /api/product (adds a product)
router.post("/", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        const newProduct = new Product(req.body)
        const savedProduct = await newProduct.save()
        res.status(201).json(savedProduct)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// POST /api/product/batch (adds a list of products)
router.post("/batch", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        for (const prod of req.body.products) {
            const newProduct = new Product(prod)
            await newProduct.save()
        }
        res.status(201).json("Sucessfully added the products.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// PUT /api/product/:_id (updates a product)
router.put("/:_id", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        let product = await Product.findById(req.params._id)
        if (!product) {
            res.status(404).send('Product not found.')
            return
        }
        Object.assign(product, req.body)
        await product.save()
        res.status(200).json(product)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// GET /api/product/:_id
router.get("/:_id", async (req, res) => {
    try {
        const product = await Product.findById(req.params._id)
        if (!product) {
            res.status(404).send('Product not found.')
            return
        }
        res.status(200).json(product)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})


// GET /api/product?genres=action&genres=adventure&sort=price&limit=10&skip=20
router.get("/", async (req, res) => {
    try {
        // Safely figures out which queries were passed in
        const dbQuery = {}

        if (req.query.genres != null) {
            // Mongodb query for any element in the array is inside req.query.genres
            if (Array.isArray(req.query.genres)) {
                dbQuery.genres = { $in: req.query.genres }
            }
            else if (typeof req.query.genres === 'string' || req.query.genres instanceof String) {
                dbQuery.genres = req.query.genres
            } else {
                console.log("Invalid genres passed to query:", req.query.genres, typeof req.query.genres)
            }
        }

        const limit = req.query.limit != null ? Math.min(parseInt(req.query.limit), 15) : 9
        const skip = req.query.skip != null ? Math.min(parseInt(req.query.skip), 100) : 0
        const sort = {}

        if (req.query.minRating != null || req.query.maxRating != null) {
            dbQuery.averageRating = {}
        }

        // Enables filtering by average rating
        if (req.query.minRating != null) {
            dbQuery.averageRating.$gte = parseFloat(req.query.minRating)
        }

        if (req.query.maxRating != null) {
            dbQuery.averageRating.$lte = parseFloat(req.query.maxRating)
        }

        sort["reviewCount"] = "desc"

        // Finds all products according to the query
        const products = await Product.find(dbQuery)
            .sort(sort)
            .skip(skip)
            .limit(limit)

        // Done!
        res.status(200).json(products)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// DELETE /api/product
router.delete("/:_id", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        const product = await Product.findById(req.params._id)
        if (!product) {
            res.status(404).send('Product not found.')
            return
        }
        await product.remove()
        res.status(200).json("Product deleted.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

module.exports = router