const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const validator = require('validator')
const {userLimiter} = require('../utils/limiter')

userRouter.post('/api/users', userLimiter, async(req, res, next) => {
    try{
        const {username, name, password} = req.body
        if(!username || !name || !password){
            return res.status(400).json({error : 'missing credentials'})
        }

        if(!validator.isStrongPassword(password)){
            return res.status(400).json({error: 'weak password'})
        }

        const salt = 10
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            username,
            name,
            passwordHash
        })
        
        const newUser = await user.save()
        res.status(201).json(newUser)
    }catch(err){
        next(err)
    }
})

module.exports = userRouter