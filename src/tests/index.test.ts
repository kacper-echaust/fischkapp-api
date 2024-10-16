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
			const dataToAdd = { front: 'front', back: 'back', author: 'author', tags: ['tag1', 'tag2'] }
			it('function returns status code 201 and create new flashcard with the correct fields', async () => {
				const res = await request(app)
					.post('/card')
					.send(dataToAdd)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('Authorization', AUTHORIZATION_KEY)
				const dataFromApi = res.body
				expect(res.status).toBe(201)
				expect(dataFromApi).toMatchObject(dataToAdd)
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
})
