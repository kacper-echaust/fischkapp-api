import { NextFunction, Request, Response } from 'express'

const checkAuthorization = (req: Request, res: Response, next: NextFunction) => {
	const authorizationHeader = req.get('Authorization')

	if (authorizationHeader === 'pss-this-is-my-secret') {
		next()
	} else {
		res.status(401).send('Unauthorized')
	}
}

export { checkAuthorization }
