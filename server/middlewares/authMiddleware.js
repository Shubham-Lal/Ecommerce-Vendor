const jwt = require('jsonwebtoken')

module.exports.authMiddleware = async (req, res, next) => {
    const { accessToken } = req.cookies

    if (!accessToken) {
        return res.status(409).json({ error: 'Unauthorized! Login again.' })
    }
    else {
        try {
            const decodeToken = await jwt.verify(accessToken, process.env.SECRET)
            req.id = decodeToken.id
            req.role = decodeToken.role
            next()
        }
        catch (error) {
            return res.status(409).json({ error: 'Please Login' })
        }
    }
}