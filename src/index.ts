import { NextFunction, Request, Response } from 'express'
import { Card } from './models/cardSchema'
import express from 'express'
export const app = express()
import cors from 'cors'

const checkAuthorization = (req: Request, res: Response, next: NextFunction) => {
	const authorizationHeader = req.get('Authorization')

	if (authorizationHeader === 'pss-this-is-my-secret') {
		next()
	} else {
		res.status(401).send('Unauthorized')
	}
}
app.use(checkAuthorization)
const allowedOrigin = process.env.ALLOWED_ORIGIN
const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		if (origin === allowedOrigin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
}

app.use(cors(corsOptions))
app.use(express.json())
app.post('/card', async (req, res) => {
	try {
		const { front, back, author, tags } = req.body
		const existingCard = await Card.findOne({ front })
		if (existingCard) return res.status(400)
		const newCard = new Card({ front, back, author, tags })
		res.status(201).json(newCard)
	} catch (error) {
		console.error(error)
	}
})
app.put('/cards/:id', async (req, res) => {
	try {
		const { front, back, tags } = req.body
		const updatedCard = await Card.findByIdAndUpdate(req.params.id, { front, back, tags }, { new: true })
		if (!updatedCard) {
			return res.status(404).send({ message: 'Card not found' })
		}
		res.status(200).send(updatedCard)
		return updatedCard
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: 'Internal server error' })
	}
})

app.get('/cards', async (req, res) => {
	try {
		const cards = await Card.find({}).sort({ timestamps: -1 })
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})
app.get('/cards/author/:author', async (req, res) => {
	try {
		const cards = await Card.find({ author: req.params.author }).sort({ timestamps: -1 })
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})
app.get('/cards/tags/:tag', async (req, res) => {
	try {
		const cards = await Card.find({ tags: req.params.tag }).sort({ timestamps: -1 })
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})
app.delete('/cards/:id', async (req, res) => {
	const fiveMinutes = 5 * 60 * 1000
	const currentTime = Date.now()
	try {
		const cardToDelete = await Card.findById(req.params.id)

		if (!cardToDelete) {
			return res.status(404).send({ message: 'Not found' })
		}
		if (currentTime - Number(cardToDelete.createdAt) > fiveMinutes) {
			return res.status(403).send({ message: 'Cannot delete card after 5 minutes' })
		}
		await Card.deleteOne({ _id: cardToDelete._id })
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: 'Internal Server Error' })
	}
})
