const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
const app = express()

app.use(express.static('dist'))
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
            id: uuidv4(),
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
    const topicIndex = topics.findIndex(t => t.id === id)
    let updatedVal = {...topics[topicIndex]}
    const confiExi = body.confidence !== undefined
    const hourExi = body.hoursStudied !== undefined
    const masExi = body.mastered !== undefined

    if(topicIndex === -1){
        return res.status(404).json({error: 'Not found'})
    }
        if(confiExi){
            if(typeof body.confidence === 'number' && body.confidence >=0 && body.confidence <= 5){
                updatedVal.confidence = body.confidence
            } else {
            return res.status(400).json({error: 'invalid input'})
            }
        }
        if(hourExi){
            if(typeof body.hoursStudied === 'number' && body.hoursStudied >=0){
                updatedVal.hoursStudied = body.hoursStudied
            } else {
                return res.status(400).json({error: 'invalid input'})
            }
        }
        if(masExi){
            if(typeof body.mastered === 'boolean'){
                updatedVal.mastered = body.mastered
            } else {
            return res.status(400).json({error: 'invalid input'})
            }
        }

        updatedVal.lastPracticed = new Date().toISOString().split('T')[0]
        topics[topicIndex] = updatedVal
        return res.status(200).json(updatedVal)

})

app.delete('/api/topics/:id', (req, res) => {
    const id = req.params.id
    topics = topics.filter(t => t.id !== id)
    return res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})