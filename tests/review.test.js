// POST 'api/review/:id' create review
// DELETE 'api/review/:id' delete review
// PUT 'api/review/:id' update a review
// GET api/review/:id' show all reviews for an item

const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(9090, () => console.log(`Of course you are, and I'm coming with 9090`))
const Review = require('../models/review')
const Item = require('../models/item')
const User = require('../models/user')
let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
    await mongoose.connection.close()
    mongoServer.stop()
    server.close()
})

describe('Test the review endpoints', () => {
    test('It should create a new review', async () => {
        const user = new User({ name: 'test', email: 'test10@email.com', password: 'test' })
        await user.save()
        const token = await user.generateAuthToken()
        const item = new Item({ name: 'drill', description: `test` })
        await item.save()
        const response = await request(app)
            .post(`/api/review/${item._id}`)
            .set(`Authorization`, `Bearer ${token}`)
            .send({ rating: 4, body: `it's pretty good` })
        expect(response.statusCode).toBe(200)
        expect(response.body.review.rating).toEqual(4)
        expect(response.body.review.body).toEqual(`it's pretty good`)
    })
    test('It should update a review instead of making a new one.', async () => {
        const item = new Item({ name: 'cabinet', description: 'test' })
        await item.save()
        const user = new User({ name: 'test', email: 'test11@email.com', password: 'test' })
        await user.save()
        const token = await user.generateAuthToken()
        const review = new Review({ item: item._id, user: user._id, rating: 5, body: `test` })
        await review.save()
        const response = await request(app)
            .post(`api/review/${item._id}`)
            .set(`Authorization`, `Bearer ${token}`)
            .send({ rating: 3, body: `different` })
        expect(response.statusCode).toBe(200)
        expect(response.body.review.rating).toEqual(3)
        expect(response.body.review.body).toEqual(`different`)
    })
    test('It should update a review', async () => {
        const item = new Item({ name: 'bucket', description: 'so useful' })
        await item.save()
        const user = new User({ name: 'test', email: 'test12@email.com', password: 'test' })
        await user.save()
        const token = await user.generateAuthToken()
        const review = new Review({ item: item._id, user: user._id, rating: 5, body: `test` })
        await review.save()
        const response = await request(app)
            .put(`/items/${item._id}/reviews`)
            .set(`Authorization`, `Bearer ${token}`)
            .send({ rating: 1, body: `different` })
        expect(response.statusCode).toBe(200)
        expect(response.body.review.rating).toEqual(1)
        expect(response.body.review.body).toEqual(`different`)
    })
    test('It should delete a review', async () => {
        const item = new Item({ name: 'hammer', description: `test` })
        await item.save()
        const user = new User({ name: 'test', email: 'test13@email.com', password: 'test' })
        await user.save()
        const token = await user.generateAuthToken()
        const review = new Review({ item: item._id, user: user._id, rating: 4, body: `test` })
        await review.save()
        const response = await request(app)
            .delete(`/items/${item._id}/reviews`)
            .set(`Authorization`, `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
    })
    test('It should show reviews for an item', async () => {
        const item = new Item({ name: 'toolbox', description: 'test' })
        await item.save()
        const user1 = new User({ name: 'test', email: 'test14@email.com', password: 'test' })
        await user1.save()
        const user2 = new User({ name: 'test', email: 'test15@email.com', password: 'test' })
        await user2.save()
        const review1 = new Review({ item: item._id, user: user1._id, rating: 1, body: `bad` })
        await review1.save()
        const review2 = new Review({ item: item._id, user: user2._id, rating: 5, body: `best` })
        await review2.save()
        item.reviews = [ review1._id, review2._id ]
        await item.save()
        const response = await request(app)
            .get(`/items/${item._id}/reviews`)
        expect.objectContaining(review1)
        expect.objectContaining(review2)
    })
})