const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        required: true, 
        unique: true
    },
    name: {
        type: String, 
        minlength: 3,
        required: true
    },
    passwordHash: {
        type: String, 
        required: true
    },
    topic: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic'
        }
    ]
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User