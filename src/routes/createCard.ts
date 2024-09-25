import { Card } from '../models/cardSchema'
import { Request, Response } from 'express'

const express = require('express')
const app = express()

app.post('/card', async (req: Request, res: Response) => {
	const { front, back, tags, author } = req.body

	try {
		const existingCard = await Card.findOne({ front })
		if (existingCard) {
			return res.status(409).json({ error: 'Card with this front value already exist' })
		}

		const newCard = new Card({ front, back, tags, author })
		await newCard.save()

		res.status(201).json(newCard)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
})
