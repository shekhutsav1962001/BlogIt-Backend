require('dotenv').config()
const jwt = require('jsonwebtoken')
exports.authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.json({ error: "unauthorized request", status: 401 })
    }

    let token = req.headers.authorization.split(' ')[1]
    if (token == 'null') {
        return res.json({ error: "unauthorized request", status: 401 })
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWTSECRETKEY)
    } catch (error) {
        return res.json({ error: "unauthorized request", status: 401 })
    }
    if (!payload) {
        return res.json({ error: "unauthorized request", status: 401 })
    }

    req.userid = payload.id;
    req.email = payload.email;

    next()
}
