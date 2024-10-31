const allowedOrigin = process.env.ALLOWED_ORIGIN

const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		if (origin === allowedOrigin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
}

export { corsOptions }
