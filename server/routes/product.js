const router = require('express').Router()

// http://localhost:5008/api/product/


router.get("/usertest", (req, res) => {
    res.send("Hello from product route.")
})

module.exports = router