import { Request, Response } from 'express'

const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.get('/', (req: Request, res: Response) => {
	res.send('Hello world')
})
app.listen(port, () => {
	console.log('Server is running...')
})
