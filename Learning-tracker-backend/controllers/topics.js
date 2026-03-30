const { userExtractor } = require('../middleware/auth')
const Topic = require('../models/topic')
const topicsRouter = require('express').Router()
const {topicsLimiter} = require('../utils/limiter')

topicsRouter.get('/api/topics', userExtractor, topicsLimiter, async(req, res, next) => {
   try{
        const topics = await Topic.find({creator: req.user._id})

        res.status(200).json(topics)
   }catch(err){
        next(err)
   }
})

topicsRouter.post('/api/topics', userExtractor, topicsLimiter, async(req, res, next) => {
    try{
        const {topic, confidence, hoursStudied, mastered, lastPracticed} = req.body
        if(topic === undefined || confidence === undefined){
            return res.status(400).json({error: 'missing content'})
        }

        const user = req.user
        const newTopic = new Topic({
            topic,
            confidence,
            hoursStudied,
            mastered,
            lastPracticed,
            creator: user._id
        })

        const result = await newTopic.save()
        user.topic = user.topic.concat(newTopic._id)
        await user.save()

        res.status(201).json(result)
    }catch(err){
        next(err)
    }
})

topicsRouter.put('/api/topics/:id', userExtractor, topicsLimiter, async(req, res, next) => {
    try{
        const id = req.params.id
        const {topic, confidence, hoursStudied, mastered, lastPracticed} = req.body
        const selectedTopic = await Topic.findById(id)

        if(!selectedTopic){
            return res.status(404).json({error: 'this topic doesnt exist'})
        }

        if(selectedTopic.creator.id.toString() !== req.user._id.toString()){
            return res.status(403).json({error: 'only the creator can update this topic'})
        }

        if(topic !== undefined) selectedTopic.topic = topic
        if(confidence !== undefined) selectedTopic.confidence = confidence
        if(hoursStudied !== undefined) selectedTopic.hoursStudied = hoursStudied
        if(mastered !== undefined) selectedTopic.mastered = mastered
        if(lastPracticed !== undefined) selectedTopic.lastPracticed = lastPracticed

        const changedTopic = await selectedTopic.save()
        res.status(200).json(changedTopic)
    }catch(err){
        next(err)
    }
})

topicsRouter.delete('/api/topics/:id', userExtractor, topicsLimiter, async(req, res, next) => {
    try{
        const id = req.params.id
        const selectedTopic = await Topic.findById(id)

        if(!selectedTopic){
            return res.status(404).json({error: 'this topic doesnt exist'})
        }

        if(selectedTopic.creator.id.toString() !== req.user._id.toString()){
            return res.status(403).json({error: 'only the creator can delete this topic'})
        }

        await Topic.findByIdAndDelete(id)
        res.status(204).end()
    }catch(err){
        next(err)
    }
})

module.exports = topicsRouter