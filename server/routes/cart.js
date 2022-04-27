const router = require('express').Router()

// http://localhost:5008/api/cart/


router.get("/usertest", (req, res) => {
    res.send("Hello from cart route.")
})

module.exports = router