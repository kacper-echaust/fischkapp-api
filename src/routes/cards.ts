import { Router } from 'express'
import {
	deleteFlaschard,
	getAllFlaschcards,
	getFlaschcardsByAuthor,
	getFlaschcardsByTag,
	updateFlaschcard,
} from '../controllers/flaschcardsController'
const router = Router()
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
router.route('/:id').post(updateFlaschcard)
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
router.route('/').get(getAllFlaschcards)
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
router.route('/author/:author').get(getFlaschcardsByAuthor)
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
router.route('/tags/:tag').get(getFlaschcardsByTag)
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
router.route('/:id').delete(deleteFlaschard)

export default router
