import { Card } from './models/cardSchema'
const express = require('express')
const app = express()

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
		await Card.findByIdAndUpdate(req.params.id, { front, back, tags }, { new: true }, err => {
			if (err) return res.status(404).send({ message: 'Card not found' })
		})
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: 'Internal server error' })
	}
})
