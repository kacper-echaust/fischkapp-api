import { Card } from '../models/cardSchema'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

const mongoServer = MongoMemoryServer.create()

export const initialCardsMock = [
	{
		_id: '66f2dbc127eb2bccd809e647',
		front: '6666',
		back: '321',
		author: 'author1',
		tags: ['bla', 'bla'],
		createdAt: '2024-09-24T15:33:21.664Z',
		updatedAt: '2024-09-24T15:33:43.967Z',
		__v: 0,
	},
	{
		_id: '66f2dbe1f24078f34cc784d2',
		front: '121',
		author: 'author2',
		back: '21212121',
		tags: ['bla2', 'bla2'],
		createdAt: '2024-09-24T15:33:53.378Z',
		updatedAt: '2024-09-24T15:33:53.378Z',
		__v: 0,
	},
	{
		_id: '66f43a60d61b18fe7c279401',
		front: 'essa',
		back: 'essa',
		tags: ['bla3', 'bla3'],
		author: 'author3',
		createdAt: '2024-09-25T16:29:20.828Z',
		updatedAt: '2024-09-25T16:29:20.828Z',
		__v: 0,
	},
]
export const connectDataBase = async () => {
	const mongoUri = await (await mongoServer).getUri()

	await mongoose.connect(mongoUri)
}
export const disconnectDataBase = async () => {
	if (mongoServer) {
		await mongoose.disconnect()
		await (await mongoServer).stop()
	}
}

beforeAll(async () => {
	await connectDataBase()
})
afterAll(async () => {
	await disconnectDataBase()
})
beforeEach(async () => {
	await mongoose.connection.dropDatabase()
	Card.insertMany(initialCardsMock)
})
