const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const Topic = require('../models/topic')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const api = supertest(app)

beforeEach(async() => {
    await User.deleteMany({})
    await Topic.deleteMany({})
})

describe('testing user registration', ()=>{
    test('user object is successfully returned', async() => {
        const user = {
            username: "haymi",
            name: "haymanot",
            password: "Secure.password1"
        }

        const res = await api.post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        expect(res.body).toBeDefined()
    })
    test('user credentials sent with a missing field are invalid', async() => {
        const user = {
            username: "nigga",
            name: "rasta"
        }

        await api.post('/api/users')
        .send(user)
        .expect(400)

        expect({"error": "missing credentials"}).toBeDefined()
    })
    test('user with weak password is invalid', async() => {
        const user = {
            username: "teka",
            name: "tekalign",
            password: "123456"
        }

        await api.post('/api/users')
        .send(user)
        .expect(400)

        expect({"error": "weak password"}).toBeDefined()
    })
        test('users with the same username are invalid', async() => {
        const user1 = {
            username: "nab",
            name: "nabek",
            password: "Secure.password1"
        }

        await api.post('/api/users')
        .send(user1)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const user2 = {
            username: "nab",
            name: "keyo",
            password: "123Secure?password"
        }

        const res = await api.post('/api/users')
        .send(user2)
        .expect(409)
        .expect('Content-Type', /application\/json/)

        expect(res.body.error).toBe("Duplicate key error")
    })
})

describe('testing the login route', () => {
    beforeEach(async() => {
        const user = {
            username: "haymi",
            name: "haymanot",
            password: "Secure.password1"
        }

        await api.post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })
    test('user can successfully login', async() => {
        const credentials = {
            username: "haymi",
            password: "Secure.password1"
        }

        const res = await api.post('/api/login')
        .send(credentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect({token: res.token, username: res.username, name: res.name}).toBeDefined()
    })
    test('a user with a wrong password can not loggin', async() => {
        const credentials = {
            username: "haymi",
            password: "Secure.password"
        }

        const res = await api.post('/api/login')
        .send(credentials)
        .expect(401)
        
        expect(res.body.error).toBe("invalid password or username")
    })
    test('a non existing user can not be logged in to', async() => {
        const credentials = {
            username: "samson",
            password: "Decentpasswor123?"
        }

        const res = await api.post('/api/login')
        .send(credentials)
        .expect(401)
        
        expect(res.body.error).toBe("invalid password or username")
    })
    test.only('a user can not loggin without credentials', async() => {
        const credentials = {
            password: "Secure.password1"
        }

        const res = await api.post('/api/login')
        .send(credentials)
        .expect(400)
        
        expect(res.body.error).toBe("missing credentials")
    })
})

describe('testing the topics route', () => {
    let token = null
    beforeEach(async() => {
        const user = {
            username: "haymi",
            name: "haymanot",
            password: "Secure.password1"
        }

        await api.post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const credentials = {
            username: "haymi",
            password: "Secure.password1"
        }

        const res = await api.post('/api/login')
        .send(credentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        token = res.body.token
    })
    test('topic creators id can be found', async() => {
        const newTopic = {
            topic: 'Shadow slave is the greatest fiction oat',
            confidence: 5
        }
        
        const res = await api.post('/api/topics')
        .set('Authorization', `Bearer ${token}`)
        .send(newTopic)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        expect(res.body.creator).toBe(decodedToken.id)
    })
    test('only topics that have been created by user can be returned', async() => {
        const newTopic = {
            topic: 'another one',
            confidence: 5
        }

        const res = await api.post('/api/topics')
        .set('Authorization', `Bearer ${token}`)
        .send(newTopic)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        expect(res.body).toMatchObject({topic: 'another one', confidence: 5,  hoursStudied: 0, mastered: false, creator: expect.any(String)})
    })
    let id = null
    test('a topic can be updated', async() => {
        const newTopic = {
            topic: 'Shadow slave is the greatest fiction oat',
            confidence: 5
        }
        
        const res1 = await api.post('/api/topics')
        .set('Authorization', `Bearer ${token}`)
        .send(newTopic)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        id = res1.body.id

        const updatedTopic = {
            topic: 'AOT is the greatest fiction oat'
        }

        const res2 = await api.put(`/api/topics/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedTopic)
        .expect(200)
        .expect('Content-Type', /application\/json/)


        expect(res2.body).toMatchObject({topic: 'AOT is the greatest fiction oat', confidence: 5,  hoursStudied: 0, mastered: false, creator: expect.any(String)})
    })
    test('updating another user topic will not work', async() => {
        const user2 = {
            username: "niomi",
            name: "nina",
            password: ".Password1Hashed?"
        }

        await api.post('/api/users')
        .send(user2)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const credentials = {
            username: "niomi",
            password: ".Password1Hashed?"
        }

        const res = await api.post('/api/login')
        .send(credentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const token2 = res.body.token
    
        const newTopic = {
            topic: 'Another thing is somethings something!',
            confidence: 0
        }
        
        const res1 = await api.post('/api/topics')
        .set('Authorization', `Bearer ${token2}`)
        .send(newTopic)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const id2 = res1.body.id

        const updatedTopic = {
            topic: 'Something is anotherthings anotherthing!'
        }

        const res2 = await api.put(`/api/topics/${id2}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedTopic)
        .expect(403)

        expect(res2.body.error).toBe("only the creator can update this topic")
    })
    test('a non existing topic can not be updated', async() => {
        const updatedTopic = {
            topic: 'something'
        }

        const nonExistingId = new mongoose.Types.ObjectId()
        const res = await api.put(`/api/topics/${nonExistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedTopic)
        .expect(404)


        expect(res.body.error).toBe("this topic doesnt exist")
    })
    test('a user can delete a topic he has created', async() => {
        const newTopic = {
            topic: 'Another thing is somethings something!',
            confidence: 0
        }
        
        const res = await api.post('/api/topics')
        .set('Authorization', `Bearer ${token}`)
        .send(newTopic)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const id = res.body.id

        await api.delete(`/api/topics/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    })
    test.only('deleting another user topic will not work', async() => {
        const user2 = {
            username: "niomi",
            name: "nina",
            password: ".Password1Hashed?"
        }

        await api.post('/api/users')
        .send(user2)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const credentials = {
            username: "niomi",
            password: ".Password1Hashed?"
        }

        const res = await api.post('/api/login')
        .send(credentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const token2 = res.body.token
    
        const newTopic = {
            topic: 'Another thing is somethings something!',
            confidence: 0
        }
        
        const res1 = await api.post('/api/topics')
        .set('Authorization', `Bearer ${token2}`)
        .send(newTopic)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const id2 = res1.body.id

        const res3 = await api.delete(`/api/topics/${id2}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)

        expect(res3.body.error).toBe("only the creator can delete this topic")
    })
    test('a non existing topic can not be deleted', async() => {
        const nonExistingId = new mongoose.Types.ObjectId()
        const res = await api.delete(`/api/topics/${nonExistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

        expect(res.body.error).toBe("this topic doesnt exist")
    })
})

afterAll(async() => {
    await mongoose.connection.close()
})