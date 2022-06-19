const jwt = require('jsonwebtoken')

// Helper function that verifies that the client-sent JWT token is valid
const verifyJWTToken = (req, res, next) => {
    const authHeader = req.headers.token

    if (authHeader != null) {
        jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET_KEY, (err, decodedToken) => {
            if (err != null) {
                res.status(403).json({ message: 'Invalid token.' })
            } else {
                req.user = decodedToken
                next() // Goes to router (continues running request)
            }
        })
    }
    else {
        return res.status(403).send('Unauthorized')
    }
}

// Helper function that verifies that the client-sent JWT token is valid AND determines if the user has write permissions
const authorizeJWTToken = (settings) => {
    return (req, res, next) => {
        verifyJWTToken(req, res, () => {
            const adminOnly = settings.adminOnly || false
            if (req.user.isAdmin) {
                next() // Goes to router (continues running request)
            }
            else if (!adminOnly && String(req.user.id) === String(req.params._id)) {
                next() // Goes to router (continues running request)
            }
            else {
                res.status(403).send('Forbidden')
            }
        })
    }
}

module.exports = { verifyToken: verifyJWTToken, authorizeToken: authorizeJWTToken }