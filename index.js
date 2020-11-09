const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const SocketIO = require('socket.io')
var vecConect = []

require('dotenv').config()

const servidor = express()

servidor.use(cors())
servidor.use(express.json())
servidor.use(express.urlencoded({ extended: false }))
servidor.use(morgan('dev'))

servidor.set('port', process.env.PORT || 5000)

//TODO: MIDDELWARE
servidor.use(require('./ROUTER/checkLogin'))
servidor.use('/api/login', require('./ROUTER/login'))
servidor.use('/api/getuserlogin', require('./ROUTER/getUserLogin'))
servidor.use('/api/usuario', require('./ROUTER/usuarios'))

const myServerExpress = servidor.listen(servidor.get('port'), e => {
	if (e) console.error(e)
	else {
		vecConect = []
		console.log('Conectado en el puerto 5000')
	}
})

//TODO: WEBSOCKET

const io = SocketIO.listen(myServerExpress)

io.on('connection', socket => {
	socket.on('disconnect', user => {
		var index = -1
		vecConect.forEach((u, i) => {
			if (u.idConexion === socket.id) {
				index = vecConect.indexOf(u)
				return
			}
		})
		if (index !== -1) {
			vecConect.splice(index, 1)
			io.sockets.emit('updateConect', vecConect)
		}
	})
	socket.on('sendUserConected', usuario => {
		vecConect = [...vecConect, { idConexion: socket.id, usuario: usuario }]
		io.sockets.emit('updateConect', vecConect)
	})

	socket.on('enviarMsj:react-node', datos => {
		socket.to(datos.idSocketReceptor).emit('resibirMsj:node-react', {
			idSocketEmisor: socket.id,
			nombreEmisor: datos.nombre,
			mensajeRecibido: datos.mensaje,
		})
	})

	socket.on('escribiendo:react-node', datos => {
		socket.to(datos.idSocketEmisor).emit('escribiendo:node-react', {
			idSocketEmisor: socket.id,
			nombreEmisor: datos.nameUser,
			es: datos.es,
		})
	})
})
