import { Router } from 'express'
import { addNewFlashcard } from '../controllers/flaschcardsController'
const router = Router()
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
router.route('/').post(addNewFlashcard)

export default router
