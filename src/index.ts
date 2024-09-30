import { Card } from './models/cardSchema'
const express = require('express')
const app = express()
const cors = require('cors')

const allowedOrigin = process.env.ALLOWED_ORIGIN
const corsOptions = {
	origin: (origin,callback) => {
		if(origin === allowedOrigin){
			callback(null,true)
		} else{
			callback(new Error('Not allowed by CORS'))
		}
	}
	},
}

app.use(cors(corsOptions))

app.post('/card', async (req, res) => {
	try {
		const { front, back, author, tags } = req.body
		const existingCard = await Card.findOne({ front })
		if (existingCard) return res.json({ message: 'This front value already exist' })
		const newCard = await new Card({ front, back, author, tags })
		res.json(newCard)
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
		if (currentTime - cardToDelete.createdAt > fiveMinutes) {
			return res.status(403).send({ message: 'Cannot delete card after 5 minutes' })
		}
		await Card.deleteOne(cardToDelete)
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: 'Internal Server Error' })
	}
})
