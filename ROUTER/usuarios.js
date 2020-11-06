const { Router } = require('express')

const router = Router()

router.post('/singup', async (req, res) => {
	const { abrirConexionPOOL, cerrarConexionPOOL } = require('npm-conexion-sql')
	const { Request, VarChar } = require('mssql')
	const bcrypt = require('bcrypt')
	const { emailUsuario, pwUsuario, nombreUsuario, apellidoUsuario } = req.body

	try {
		const conexion = await abrirConexionPOOL('singup')
		const myReques = new Request(conexion)
		myReques.input('emailUsuario', VarChar, emailUsuario)
		myReques.input('pwUsuario', VarChar, bcrypt.hashSync(pwUsuario, 10))
		myReques.input('nombreUsuario', VarChar, nombreUsuario)
		myReques.input('apellidoUsuario', VarChar, apellidoUsuario)
		const result = await myReques.execute('pa_singup')
		if (result) {
			cerrarConexionPOOL()
			if (result.recordset[0].OK)
				res.status(200).json({ opOK: true, mensaje: result.recordset[0].OK })
			else {
				res.status(200).json({ opOK: false, mensaje: result.recordset[0].noOK })
			}
		}
	} catch (e) {
		cerrarConexionPOOL()
		res.status(200).json({ opOK: false, mensaje: e.message })
	}
})

module.exports = router
