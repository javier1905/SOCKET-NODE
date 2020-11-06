module.exports = function (req, res, next) {
	const jwt = require('jsonwebtoken')
	if (req.path !== '/api/login' && req.path !== '/api/usuario/singup') {
		if (!req.headers.authorization) {
			res.status(200).json({ mensaje: 'No envio el token en el headers', logOK: false })
		} else {
			const token = req.headers.authorization.split(' ')[1]
			jwt.verify(token, process.env.SECRET_TOKEN, (e, datos) => {
				if (e) {
					res
						.status(200)
						.json({ mensaje: e.message, otro: 'error  en la commprobacion token', logOK: false })
				} else return next()
			})
		}
	} else return next()
}
