require('dotenv').config()
const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {loginLimiter} = require('../utils/limiter')

loginRouter.post('/api/login', loginLimiter, async(req, res, next) => {
    try{
        const {username, password} = req.body
        if(!username || !password){
            return res.status(400).json({error : 'missing credentials'})
        }

        const user = await User.findOne({username})
        
        const correctPassword = user === null ? false : await bcrypt.compare(password, user.passwordHash)

        if(!correctPassword){
            return res.status(401).json({error: 'invalid password or username'})
        }

        const userToken = {
            username: user.username,
            id: user._id
        }

        const token = jwt.sign(userToken, process.env.SECRET, {expiresIn: '1h'})
        res.status(200).json({token, username: user.username, name: user.name})
    }catch(err){
        next(err)
    }
})

module.exports = loginRouter