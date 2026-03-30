const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('Authorization')
    if(authorization && authorization.startsWith('Bearer ')){
        req.token = authorization.replace('Bearer ', '')
    }

    next()
}

const userExtractor = async(req, res, next) => {
    if (!req.token) {
        return res.status(401).json({ error: 'token missing' })
    }
    
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    req.user = await User.findById(decodedToken.id)

    next()
}

module.exports = {tokenExtractor, userExtractor}