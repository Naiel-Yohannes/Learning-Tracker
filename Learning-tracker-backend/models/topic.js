const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
    topic: {
        type: String,
        minlength: 5,
        required: true
    },
    confidence: {
        type: Number, 
        min: 0, 
        max: 5,
        default: 0
    },
    hoursStudied: {
        type: Number,
        min: 0,
        default: 0
    },
    mastered: {
        type: Boolean,
        default: false
    },
    lastPracticed: {
        type: Date
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

topicSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

topicSchema.index({topic: 1, creator: 1}, {unique: true})

const Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic