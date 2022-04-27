const router = require('express').Router()

// http://localhost:5008/api/order/


router.get("/usertest", (req, res) => {
    res.send("Hello from user route.")
})

module.exports = router