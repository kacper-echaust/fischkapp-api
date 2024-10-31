import { Request, Response } from 'express'

import { Card } from '../models/cardSchema'

//POST /cards/:id
const updateFlaschcard = async (req: Request, res: Response) => {
	try {
		const { front, back, tags, author } = req.body
		const updatedCard = await Card.findByIdAndUpdate(req.params.id, { front, back, tags, author }, { new: true })
		if (!updatedCard) {
			return res.status(404).send({ message: 'Card not found' })
		}
		res.status(200).send(updatedCard)
		return updatedCard
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: 'Internal server error' })
	}
}
//GET /cards
const getAllFlaschcards = async (req: Request, res: Response) => {
	try {
		const cards = await Card.find({}).sort({ timestamps: -1 })
		console.log(cards)
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
}

//GET /cards/author/:author
const getFlaschcardsByAuthor = async (req: Request, res: Response) => {
	try {
		const cards = await Card.find({ author: req.params.author }).sort({ timestamps: -1 })
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
}

//GET /cards/tags/:tag
const getFlaschcardsByTag = async (req: Request, res: Response) => {
	try {
		const cards = await Card.find({ tags: req.params.tag }).sort({ timestamps: -1 })
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
}

//DELETE /cards/:id
const deleteFlaschard = async (req: Request, res: Response) => {
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
		return res.status(204).send()
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: 'Internal Server Error' })
	}
}

//POST /card
const addNewFlashcard = async (req: Request, res: Response) => {
	try {
		const existingCard = await Card.find({ front: req.body.front })
		if (existingCard.length > 0) return res.status(400).json({ message: 'Card already exist' })
		const newCard = new Card(req.body)
		res.status(201).json(newCard)
	} catch (error) {
		console.error(error)
	}
}

export {
	updateFlaschcard,
	getAllFlaschcards,
	getFlaschcardsByAuthor,
	getFlaschcardsByTag,
	deleteFlaschard,
	addNewFlashcard,
}
