import { NextFunction, Request, Response } from 'express'
import { Card } from './models/cardSchema'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
export const app = express()

const allowedOrigin = process.env.ALLOWED_ORIGIN

const checkAuthorization = (req: Request, res: Response, next: NextFunction) => {
	const authorizationHeader = req.get('Authorization')

	if (authorizationHeader === 'pss-this-is-my-secret') {
		next()
	} else {
		res.status(401).send('Unauthorized')
	}
}
const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		if (origin === allowedOrigin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
}

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API Fishkapp',
			version: '1.0.0',
			description: 'API Documentation for our application',
		},
		servers: [
			{
				url: 'http://localhost:4000',
			},
		],
	},
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
	},
	security: [
		{
			bearerAuth: [],
		},
	],

	apis: ['/routes/*.ts'],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(checkAuthorization)
app.use(cors(corsOptions))
app.use(express.json())

/**
 * @swagger
 * paths:
 * /card:
 * 	post:
 * 		summary: Add new card
 * 		description: Add new card
 * 		security:
 * 		- bearerAuth: []
 * 		responses:
 * 		201:
 * 			description: Succesfully added card
 * content:
 *           application/json:
 *             schema:
 *               type: object
 * 		400:
 * 			description: Card already exist
 * 		401:
 * 			description: Unauthorized
 *
 */
app.post('/card', async (req, res) => {
	try {
		const existingCard = await Card.find({ front: req.body.front })
		if (existingCard.length > 0) return res.status(400).json({ message: 'Card already exist' })
		const newCard = new Card(req.body)
		res.status(201).json(newCard)
	} catch (error) {
		console.error(error)
	}
})
/**
 * @swagger
 * paths:
 * /card/:id:
 * 	put:
 * 		summary: Update card
 * 		description: Update existing card
 * 		security:
 * 		- bearerAuth: []
 * 		responses:
 * 		200:
 * 			description: Succesfull update card
 * 		content:
 *           application/json:
 *             schema:
 *               type: object
 * 		404:
 * 			description: Card not found
 * 		500:
 * 			description: Internal server error
 * 		401:
 * 			description: Unauthorized
 *
 */
app.put('/cards/:id', async (req, res) => {
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
})
/**
 * @swagger
 * paths:
 * /cards:
 * 	get:
 * 		summary: Get cards
 * 		description: Get all cards
 * 		security:
 * 		- bearerAuth: []
 * 		responses:
 * 		500:
 * 			description: Internal server error
 * 		401:
 * 			description: Unauthorized
 *
 */
app.get('/cards', async (req, res) => {
	try {
		const cards = await Card.find({}).sort({ timestamps: -1 })
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})
/**
 * @swagger
 * paths:
 * /cards/author/:author:
 * 	get:
 * 		summary: Get cards
 * 		description: Get cards by author route
 * 		security:
 * 		- bearerAuth: []
 * 		responses:
 * 		500:
 * 			description: Internal server error
 * 		401:
 * 			description: Unauthorized
 *
 */
app.get('/cards/author/:author', async (req, res) => {
	try {
		const cards = await Card.find({ author: req.params.author }).sort({ timestamps: -1 })
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})
/**
 * @swagger
 * paths:
 * /cards/tags/:tag:
 * 	get:
 * 		summary: Get cards
 * 		description: Get cards by tag route
 * 		security:
 * 		- bearerAuth: []
 * 		responses:
 * 		500:
 * 			description: Internal server error
 * 		401:
 * 			description: Unauthorized
 *
 */
app.get('/cards/tags/:tag', async (req, res) => {
	try {
		const cards = await Card.find({ tags: req.params.tag }).sort({ timestamps: -1 })
		res.send(cards)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal Server Error')
	}
})
/**
 * @swagger
 * paths:
 * /cards/:id:
 * 	delete:
 * 		summary: Delete card
 * 		description: Delete card by id
 * 		security:
 * 		- bearerAuth: []
 * 		responses:
 * 		204:
 * 			description: Card delete succesfully
 * 		404:
 * 			description: Not found
 * 		403:
 * 			description: Cannot delete card after 5 minutes
 * 		401:
 * 			description: Unauthorized
 * 		500:
 * 			description: Internal Server Error
 *
 */
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
		return res.status(204).send()
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: 'Internal Server Error' })
	}
})
