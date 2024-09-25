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
