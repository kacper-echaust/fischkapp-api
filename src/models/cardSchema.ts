const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
	front: {
		type: String,
		required: true,
		unique: true,
	},
	back: {
		type: String,
		required: true,
	},
	tags: {
		type: [String],
		default: [],
	},
	author: {
		type: String,
		required: true,
	},
})

export const Card = mongoose.model('Card', cardSchema)



