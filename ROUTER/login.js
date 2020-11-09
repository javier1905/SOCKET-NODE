const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = Router()

router.post('/', async (req, res) => {
	const { abrirConexionPOOL, cerrarConexionPOOL } = require('npm-conexion-sql')
	const { emailUsuario, pwUsuario } = req.body
	const { Request, VarChar } = require('mssql')
	try {
		const conexion = await abrirConexionPOOL('logueoUsuario')
		const myRequest = new Request(conexion)
		myRequest.input('emailUsuario', VarChar, emailUsuario)
		const result = await myRequest.execute('pa_login')
		if (result) {
			cerrarConexionPOOL()
			if (result.rowsAffected[0] === 0)
				res.status(200).json({ mensaje: 'Usuario inexistente ', logOK: false })
			else {
				if (!bcrypt.compareSync(pwUsuario, result.recordset[0].pwUsuario)) {
					res.status(200).json({ mensaje: 'Password incorrecta ', logOK: false })
				} else {
					const user = {
						idUsuario: result.recordset[0].idUsuario,
						emailUsuario: result.recordset[0].emailUsuario,
						nombreUsuario: result.recordset[0].nombreUsuario,
						apellidoUsuario: result.recordset[0].apellidoUsuario,
						idPerfil: result.recordset[0].idPerfil,
					}
					jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: 14400 }, (error, token) => {
						error
							? res.status(200).json({ mensaje: 'Error al generar el token', logOK: false })
							: res.status(200).json({ token, logOK: true })
					})
				}
			}
		} else {
			cerrarConexionPOOL()
			res.status(200).json(result)
		}
	} catch (e) {
		cerrarConexionPOOL()
		res.status(403).json({ mensaje: e.message })
	}
})

module.exports = router
