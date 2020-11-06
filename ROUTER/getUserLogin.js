const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
	const jwt = require('jsonwebtoken')
	const token = req.headers.authorization.split(' ')[1]
	jwt.verify(token, process.env.SECRET_TOKEN, (e, d) => {
		e
			? res.status(200).json({ mensaje: e.name, logOK: false })
			: res.status(200).json({ usuario: d, logOK: true })
	})
})
module.exports = router
