import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { connectDB } from './config/database'
import { swaggerDocs } from './config/swagger'
import swaggerUi from 'swagger-ui-express'
import { checkAuthorization } from './middlewares/authorization'

import flashcardsRouter from './routes/cards'
import flashcardRouter from './routes/card'

const PORT = process.env.PORT || 4000
connectDB()

export const app = express()

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(cors(corsOptions))
app.use(checkAuthorization)

app.use(express.json())
app.use('/cards', flashcardsRouter)
app.use('/card', flashcardRouter)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
