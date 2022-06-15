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

// PUT /api/product/:id (updates a product)
router.put("/:id", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
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

// GET /api/product/:id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
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


// GET /api/product?genres=action&genres=adventure&sort=price&limit=10&skip=20&sortAsc=true
router.get("/", async (req, res) => {
    try {
        // Safely figures out which queries were passed in
        const query = {}

        if (req.query.genres != null) {
            query.genres = { $in: req.query.genres.split(",") }
        }

        const limit = req.query.limit != null ? Math.min(parseInt(req.query.limit), 15) : 9
        const skip = req.query.skip != null ? Math.min(parseInt(req.query.skip), 100) : 0
        const sort = {}

        if (req.query.sort != null) {
            sort[req.query.sort] = req.query.sortAsc ? "asc" : "desc"
        }
        else {
            sort["reviewCount"] = "desc"
        }

        // Finds all products according to the query
        const products = await Product.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)

        // Done!
        res.status(200).json(products)
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// DELETE /api/product
router.delete("/:id", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
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