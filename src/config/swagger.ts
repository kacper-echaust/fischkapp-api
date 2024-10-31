import swaggerJsdoc from 'swagger-jsdoc'

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



export { swaggerDocs}