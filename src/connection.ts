const { MongoClient } = require('mongodb')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kacper:kacper@cluster0.s1h02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

async function listDatabases(client) {
	databasesList = await client.db().admin().listDatabases()

	console.log('Databases:')
	databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}

const main = async () => {
	const uri = MONGODB_URI
	const client = new MongoClient(uri)
	try {
		await client.connect()
		await listDatabases(client)
	} catch (e) {
		console.error('Failed to connect to the database:',e)
	} finally {
		await client.close()
	}
}
main().catch(console.error)