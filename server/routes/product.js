const router = require('express').Router()

// http://localhost:5008/api/product/

// POST /api/product/:id (adds or updates a product)
router.post("/:id", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body, { 
            $merge: req.body
        }, { new: true }) // Returns the updated user
        res.status(200).json("Successfully updated product.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

// GET /api/product?genres=action&genres=adventure&sort=price&limit=10&skip=20&sortAsc=true
router.get("/", authorizeToken({ adminOnly: true }), async (req, res) => {
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
router.delete("/", authorizeToken({ adminOnly: true }), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(201).json("Product deleted.")
    }
    catch (err) {
        console.warn(err)
        res.status(500).json(err)
    }
})

module.exports = router