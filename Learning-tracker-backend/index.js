const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

let topics = [
  {
      "id": "1",
      "topic": "Array Methods",
      "hoursStudied": 15,
      "confidence": 3,
      "mastered": false,
      "lastPracticed": "2025-12-28"
    },
    {
      "id": "2",
      "topic": "React State",
      "hoursStudied": 5,
      "confidence": 3,
      "mastered": false,
      "lastPracticed": "2024-01-13"
    },
    {
      "id": "3",
      "topic": "useEffect Hook",
      "hoursStudied": 2,
      "confidence": 0,
      "mastered": true,
      "lastPracticed": "2024-01-08"
    }
]

app.get('/api/topics', (req, res) => {
    if(topics.length >= 0){
        return res.status(200).json(topics)
    }
    res.status(404).end()
})

app.get('/api/topics/:id', (req, res) => {
    const id = req.params.id
    const topic = topics.find(t => t.id === id)
    if(topic) {
        return res.status(200).json(topic)
    }
    res.status(404).json({error: 'Topic not found'})
})

app.post('/api/topics', (req, res) => {
    const body = req.body
    const exists = topics.find(t => t.topic.toLowerCase() === body.topic.toLowerCase())
    if(exists){
        return res.status(409).json({error: 'Topic already exists'})
    }
    if(body.topic){
        const newTopic = {
            id: String(Math.max(...topics.map(t => Number(t.id))) + 1),
            topic: body.topic,
            hoursStudied: body.hoursStudied,
            confidence: body.confidence,
            mastered: body.mastered,
            lastPracticed: new Date().toISOString().split('T')[0]
        }

        topics = topics.concat(newTopic)
        return res.status(201).json(newTopic)
    }
})

app.put('/api/topics/:id', (req, res) => {
    const body = req.body
    const id = req.params.id
    const topic = topics.find(t => t.id === id)
    const exists = typeof body.hoursStudied === 'number' && typeof body.confidence === 'number' && typeof body.mastered === 'boolean'
    if(topic){
        if(exists){
            topics = topics.map(t => {
                if(t.id === id) {
                    return {...t, hoursStudied: body.hoursStudied, confidence: body.confidence, mastered: body.mastered, lastPracticed: new Date().toISOString().split('T')[0]} 
                }
                return t
            })
            return res.status(200).json(topics.find(t => t.id === id))
        }
        return res.status(400).end()
    } else{
    return res.status(404).end()}
})

app.delete('/api/topics/:id', (req, res) => {
    const id = req.params.id
    topics = topics.filter(t => t.id !== id)
    return res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})