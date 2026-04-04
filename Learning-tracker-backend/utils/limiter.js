const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
})

const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
})

const topicsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

module.exports = {loginLimiter, userLimiter, topicsLimiter}