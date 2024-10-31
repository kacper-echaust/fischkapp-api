import mongoose from 'mongoose'
const MONGODB_URI =
	process.env.MONGODB_URI ||
	'mongodb+srv://kacper:kacper@cluster0.s1h02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = async () => {
	const uri = MONGODB_URI
	try {
		await mongoose.connect(uri)
		console.log('Połączono z bazą mongoDB')
	} catch (e) {
		console.error('Failed to connect to the database:', e)
	}
}
connectDB().catch(console.error)

export { connectDB }
