const SECRET_KEY = 'this is secret key asdfghjkl'
const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
    let token = req.headers.authorization
    try {
        var decoded = jwt.verify(token, SECRET_KEY)
        req.userData = decoded
        next()
    }
    catch (err) {
        res.status(500).json({
            message: 'Auth Failed'
        })
    }
}

module.exports = checkAuth