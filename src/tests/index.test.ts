import request from 'supertest'
import { app } from '../index'
import { initialCardsMock } from './test-setup'
import { Card } from '../models/cardSchema'
import { ObjectId } from 'mongodb'

const AUTHORIZATION_KEY = 'pss-this-is-my-secret'
const newData = {
	front: 'front',
	back: 'back',
	author: 'author',
	tags: ['tag1', 'tag2'],
}
describe('flashcards', () => {
	describe('finding cards', () => {
		describe('get all cards route', () => {
			it('function need to return code 200,flashcards in the correct order and correct number of flashcards', async () => {
				const res = await request(app).get('/cards').set('Authorization', AUTHORIZATION_KEY)
				const data = res.body
				expect(res.status).toBe(200)
				expect(data).toBeInstanceOf(Array)
				expect(data).toEqual(initialCardsMock)
				expect(data.length).toEqual(initialCardsMock.length)

				const sortedData = [...data].sort((a, b) => {
					return Date.parse(a.createdAt) - Date.parse(b.createdAt)
				})
				expect(initialCardsMock).toEqual(sortedData)
			})
		})
		describe('get cards by author route', () => {
			it('function returns an array of flashcards written by the requested author in the correct order, status 200', async () => {
				const filteredAuthor = initialCardsMock.filter(card => {
					return card.author === 'author1'
				})
				const res = await request(app).get('/cards/author/author1').set('Authorization', AUTHORIZATION_KEY)
				const data = res.body
				expect(res.status).toBe(200)
				expect(data).toBeInstanceOf(Array)
				expect(data.length).toEqual(filteredAuthor.length)

				const sortedData = [...data].sort((a, b) => {
					return Date.parse(a.createdAt) - Date.parse(b.createdAt)
				})
				expect(filteredAuthor).toEqual(sortedData)
			})
		})
		describe('get cards by tags route', () => {
			it('Function returns the correct number of flashcards with the requested tag.', async () => {
				const filteredCardsByTag = initialCardsMock.filter(card => {
					return card.tags.includes('bla')
				})

				const res = await request(app).get('/cards/tags/bla').set('Authorization', AUTHORIZATION_KEY)
				const data = res.body
				expect(res.status).toBe(200)
				expect(data).toBeInstanceOf(Array)
				expect(data.length).toEqual(filteredCardsByTag.length)
			})
		})
	})
	describe('creating cards', () => {
		describe('post card', () => {
			it('function returns status code 201 and create new flashcard with the correct fields', async () => {
				const res = await request(app)
					.post('/card')
					.send(newData)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('Authorization', AUTHORIZATION_KEY)
				const dataFromApi = res.body
				expect(res.status).toBe(201)
				expect(dataFromApi).toMatchObject(newData)
			})
			it('function return status code 400 when card with specific front value already exist', async () => {
				const res = await request(app)
					.post('/card')
					.send(initialCardsMock[0])
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('Authorization', AUTHORIZATION_KEY)
				expect(res.status).toBe(400)
			})
		})
	})
	describe('editing cards', () => {
		it('function returns status code 200 and updates the requested flaschcard with the correct fields', async () => {
			const res = await request(app)
				.put(`/cards/${initialCardsMock[0]._id}`)
				.send(newData)
				.set('Authorization', AUTHORIZATION_KEY)
			const data = res.body
			expect(res.status).toBe(200)
			expect(data).toMatchObject(newData)
		})
	})
	describe('delete cards', () => {
		it('function returns code 204 if card was created less than 5 minutes ago and deleted correctly', async () => {
			const idCardToDelete = new ObjectId(Date.now() - 5000).toString()
			Card.create({
				...newData,
				_id: idCardToDelete,
				createdAt: new Date().toISOString(),
			})
			const res = await request(app).delete(`/cards/${idCardToDelete}`).set('Authorization', AUTHORIZATION_KEY)
			expect(res.status).toBe(204)
			expect(res.body).toEqual({})
		})
		it('function returns status code 403 if the flachcard was created more than 5 minutes ago', async () => {
			const res = await request(app)
				.delete(`/cards/${initialCardsMock[0]._id}`)
				.set('Authorization', AUTHORIZATION_KEY)

			expect(res.status).toBe(403)
		})
		it('function returns status code 404 if the requested flashcard does not exist', async () => {
			const idNotExistingCard = new ObjectId(Date.now() - 5000).toString()
			const res = await request(app).delete(`/cards/${idNotExistingCard}`).set('Authorization', AUTHORIZATION_KEY)

			expect(res.status).toBe(404)
		})
	})
})
