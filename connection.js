const { MongoClient } = require('mongodb')
const URI_ID = process.env.URI || 'kacper:kacper'
async function listDatabases(client) {
	databasesList = await client.db().admin().listDatabases()

	console.log('Databases:')
	databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}

const main = async () => {
	const uri = `mongodb+srv://${URI_ID}@cluster0.s1h02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
	const client = new MongoClient(uri)
	try {
		await client.connect()
		await listDatabases(client)
	} catch (e) {
		console.error(e)
	} finally {
		await client.close()
	}
}
main().catch(console.error)
