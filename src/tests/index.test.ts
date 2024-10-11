import request from 'supertest'
import { app } from '../index'
import { initialCardsMock } from './test-setup'

const AUTHORIZATION_KEY = 'pss-this-is-my-secret'

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
					.send({ front: 'front', back: 'back', author: 'author', tags: ['tag1', 'tag2'] })
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('Authorization', AUTHORIZATION_KEY)
				expect(res.status).toBe(201)
				expect({ front: 'front', back: 'back', author: 'author', tags: ['tag1', 'tag2'] })
			})
			it('function return status code 400 when card with specific front value already exist', async () => {
				const res2 = await request(app)
					.post('/card')
					.send(initialCardsMock[0].front)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('Authorization', AUTHORIZATION_KEY)
				expect(res2.status).toBe(400)
			})
		})
	})
	describe('editing cards', () => {
		describe('update card by id', () => {
			it('function return code 200 and updates the requested flashcard with the correct fields', async () => {
				const res = await request(app)
					.put(`/cards/${initialCardsMock[0]._id}`)
					.send({ front: 'new front value', back: 'new back value', tags: ['new tag', 'new tag 2'] })
					.set('Authorization', AUTHORIZATION_KEY)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
				expect(res.status).toBe(200)
				expect({ front: 'new front value', back: 'new back value', tags: ['new tag', 'new tag 2'] })
			})
		})
		describe('return updated card', () => {
			it('function return the updated flashcard', async () => {
				const res = await request(app).get('/cards').set('Authorization', AUTHORIZATION_KEY)
				const data = res.body

				expect(data).toContain({
					front: 'new front value',
					back: 'new back value',
					tags: ['new tag', 'new tag 2'],
				})
			})
		})
	})
})
