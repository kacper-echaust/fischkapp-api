const { MongoClient } = require('mongodb')
const MONGODB_URI =
	process.env.MONGODB_URI ||
	'mongodb+srv://kacper:kacper@cluster0.s1h02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const main = async () => {
	const uri = MONGODB_URI
	const client = new MongoClient(uri)
	try {
		await client.connect()
	} catch (e) {
		console.error('Failed to connect to the database:', e)
	} finally {
		await client.close()
	}
}
main().catch(console.error)
