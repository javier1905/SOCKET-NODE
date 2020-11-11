/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ROUTER/checkLogin.js":
/*!******************************!*\
  !*** ./ROUTER/checkLogin.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (req, res, next) {
  const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");

  if (req.path !== '/api/login' && req.path !== '/api/usuario/singup') {
    if (!req.headers.authorization) res.status(200).json({
      mensaje: 'No envio el token en el headers',
      logOK: false
    });else {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.SECRET_TOKEN, (e, datos) => {
        if (e) {
          res.status(200).json({
            mensaje: e.message,
            otro: 'error  en la commprobacion token',
            logOK: false
          });
        } else return next();
      });
    }
  } else return next();
};

/***/ }),

/***/ "./ROUTER/getUserLogin.js":
/*!********************************!*\
  !*** ./ROUTER/getUserLogin.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  Router
} = __webpack_require__(/*! express */ "express");

const router = Router();
router.get('/', (req, res) => {
  const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");

  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.SECRET_TOKEN, (e, d) => {
    e ? res.status(200).json({
      mensaje: e.name,
      logOK: false
    }) : res.status(200).json({
      usuario: d,
      logOK: true
    });
  });
});
module.exports = router;

/***/ }),

/***/ "./ROUTER/login.js":
/*!*************************!*\
  !*** ./ROUTER/login.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  Router
} = __webpack_require__(/*! express */ "express");

const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");

const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");

const router = Router();
router.post('/', async (req, res) => {
  const {
    abrirConexionPOOL,
    cerrarConexionPOOL
  } = __webpack_require__(/*! npm-conexion-sql */ "npm-conexion-sql");

  const {
    emailUsuario,
    pwUsuario
  } = req.body;

  const {
    Request,
    VarChar
  } = __webpack_require__(/*! mssql */ "mssql");

  try {
    const conexion = await abrirConexionPOOL('logueoUsuario');
    const myRequest = new Request(conexion);
    myRequest.input('emailUsuario', VarChar, emailUsuario);
    const result = await myRequest.execute('pa_login');

    if (result) {
      cerrarConexionPOOL();
      if (result.rowsAffected[0] === 0) res.status(200).json({
        mensaje: 'Usuario inexistente ',
        logOK: false
      });else {
        if (!bcrypt.compareSync(pwUsuario, result.recordset[0].pwUsuario)) {
          res.status(200).json({
            mensaje: 'Password incorrecta ',
            logOK: false
          });
        } else {
          const user = {
            idUsuario: result.recordset[0].idUsuario,
            emailUsuario: result.recordset[0].emailUsuario,
            nombreUsuario: result.recordset[0].nombreUsuario,
            apellidoUsuario: result.recordset[0].apellidoUsuario,
            idPerfil: result.recordset[0].idPerfil
          };
          jwt.sign(user, process.env.SECRET_TOKEN, {
            expiresIn: 14400
          }, (error, token) => {
            error ? res.status(200).json({
              mensaje: 'Error al generar el token',
              logOK: false
            }) : res.status(200).json({
              token,
              logOK: true
            });
          });
        }
      }
    } else {
      cerrarConexionPOOL();
      res.status(200).json(result);
    }
  } catch (e) {
    cerrarConexionPOOL();
    console.log(e);
    res.status(403).json({
      logOK: false,
      mensaje: e.message
    });
  }
});
module.exports = router;

/***/ }),

/***/ "./ROUTER/usuarios.js":
/*!****************************!*\
  !*** ./ROUTER/usuarios.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  Router
} = __webpack_require__(/*! express */ "express");

const router = Router();
router.post('/singup', async (req, res) => {
  const {
    abrirConexionPOOL,
    cerrarConexionPOOL
  } = __webpack_require__(/*! npm-conexion-sql */ "npm-conexion-sql");

  const {
    Request,
    VarChar
  } = __webpack_require__(/*! mssql */ "mssql");

  const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");

  const {
    emailUsuario,
    pwUsuario,
    nombreUsuario,
    apellidoUsuario
  } = req.body;

  try {
    const conexion = await abrirConexionPOOL('singup');
    const myReques = new Request(conexion);
    myReques.input('emailUsuario', VarChar, emailUsuario);
    myReques.input('pwUsuario', VarChar, bcrypt.hashSync(pwUsuario, 10));
    myReques.input('nombreUsuario', VarChar, nombreUsuario);
    myReques.input('apellidoUsuario', VarChar, apellidoUsuario);
    const result = await myReques.execute('pa_singup');

    if (result) {
      cerrarConexionPOOL();
      if (result.recordset[0].OK) res.status(200).json({
        opOK: true,
        mensaje: result.recordset[0].OK
      });else {
        res.status(200).json({
          opOK: false,
          mensaje: result.recordset[0].noOK
        });
      }
    }
  } catch (e) {
    cerrarConexionPOOL();
    res.status(200).json({
      opOK: false,
      mensaje: e.message
    });
  }
});
module.exports = router;

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(/*! express */ "express");

const path = __webpack_require__(/*! path */ "path");

const cors = __webpack_require__(/*! cors */ "cors");

const morgan = __webpack_require__(/*! morgan */ "morgan");

const SocketIO = __webpack_require__(/*! socket.io */ "socket.io");

var vecConect = [];

__webpack_require__(/*! dotenv */ "dotenv").config();

const servidor = express();
servidor.use(cors());
servidor.use(express.json());
servidor.use(express.urlencoded({
  extended: false
}));
servidor.use(morgan('dev'));
servidor.set('port', process.env.PORT || 5000); //TODO: MIDDELWARE

servidor.use(__webpack_require__(/*! ./ROUTER/checkLogin */ "./ROUTER/checkLogin.js"));
servidor.use('/api/login', __webpack_require__(/*! ./ROUTER/login */ "./ROUTER/login.js"));
servidor.use('/api/getuserlogin', __webpack_require__(/*! ./ROUTER/getUserLogin */ "./ROUTER/getUserLogin.js"));
servidor.use('/api/usuario', __webpack_require__(/*! ./ROUTER/usuarios */ "./ROUTER/usuarios.js"));
const myServerExpress = servidor.listen(servidor.get('port'), e => {
  if (e) console.error(e);else {
    vecConect = [];
    console.log('Conectado en el puerto 5000');
  }
}); //TODO: WEBSOCKET

const io = SocketIO.listen(myServerExpress);
io.on('connection', socket => {
  socket.on('disconnect', user => {
    var index = -1;
    vecConect.forEach((u, i) => {
      if (u.idConexion === socket.id) {
        index = vecConect.indexOf(u);
        return;
      }
    });

    if (index !== -1) {
      vecConect.splice(index, 1);
      io.sockets.emit('updateConect', vecConect);
    }
  });
  socket.on('sendUserConected', usuario => {
    var index = -1;
    vecConect.forEach((u, i) => {
      try {
        if (u.usuario.emailUsuario === usuario.emailUsuario) {
          index = i;
          return;
        }
      } catch (e) {
        index = -1;
      }
    });
    index !== -1 && vecConect.splice(index, 1);
    vecConect = [...vecConect, {
      idConexion: socket.id,
      usuario: usuario
    }];
    io.sockets.emit('updateConect', vecConect);
  });
  socket.on('enviarMsj:react-node', datos => {
    console.log(datos);
    socket.to(datos.idSocketReceptor).emit('resibirMsj:node-react', {
      idSocketEmisor: socket.id,
      usuario: datos.usuario,
      mensajeRecibido: datos.mensaje
    });
  });
  socket.on('escribiendo:react-node', datos => {
    socket.to(datos.idSocketEmisor).emit('escribiendo:node-react', {
      idSocketEmisor: socket.id,
      usuario: datos.usuario,
      es: datos.es
    });
  });
});

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "mssql":
/*!************************!*\
  !*** external "mssql" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mssql");

/***/ }),

/***/ "npm-conexion-sql":
/*!***********************************!*\
  !*** external "npm-conexion-sql" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("npm-conexion-sql");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vUk9VVEVSL2NoZWNrTG9naW4uanMiLCJ3ZWJwYWNrOi8vLy4vUk9VVEVSL2dldFVzZXJMb2dpbi5qcyIsIndlYnBhY2s6Ly8vLi9ST1VURVIvbG9naW4uanMiLCJ3ZWJwYWNrOi8vLy4vUk9VVEVSL3VzdWFyaW9zLmpzIiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImJjcnlwdFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvcnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkb3RlbnZcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9yZ2FuXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibXNzcWxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJucG0tY29uZXhpb24tc3FsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJyZXEiLCJyZXMiLCJuZXh0Iiwiand0IiwicmVxdWlyZSIsInBhdGgiLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsInN0YXR1cyIsImpzb24iLCJtZW5zYWplIiwibG9nT0siLCJ0b2tlbiIsInNwbGl0IiwidmVyaWZ5IiwicHJvY2VzcyIsImVudiIsIlNFQ1JFVF9UT0tFTiIsImUiLCJkYXRvcyIsIm1lc3NhZ2UiLCJvdHJvIiwiUm91dGVyIiwicm91dGVyIiwiZ2V0IiwiZCIsIm5hbWUiLCJ1c3VhcmlvIiwiYmNyeXB0IiwicG9zdCIsImFicmlyQ29uZXhpb25QT09MIiwiY2VycmFyQ29uZXhpb25QT09MIiwiZW1haWxVc3VhcmlvIiwicHdVc3VhcmlvIiwiYm9keSIsIlJlcXVlc3QiLCJWYXJDaGFyIiwiY29uZXhpb24iLCJteVJlcXVlc3QiLCJpbnB1dCIsInJlc3VsdCIsImV4ZWN1dGUiLCJyb3dzQWZmZWN0ZWQiLCJjb21wYXJlU3luYyIsInJlY29yZHNldCIsInVzZXIiLCJpZFVzdWFyaW8iLCJub21icmVVc3VhcmlvIiwiYXBlbGxpZG9Vc3VhcmlvIiwiaWRQZXJmaWwiLCJzaWduIiwiZXhwaXJlc0luIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwibXlSZXF1ZXMiLCJoYXNoU3luYyIsIk9LIiwib3BPSyIsIm5vT0siLCJleHByZXNzIiwiY29ycyIsIm1vcmdhbiIsIlNvY2tldElPIiwidmVjQ29uZWN0IiwiY29uZmlnIiwic2Vydmlkb3IiLCJ1c2UiLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJzZXQiLCJQT1JUIiwibXlTZXJ2ZXJFeHByZXNzIiwibGlzdGVuIiwiaW8iLCJvbiIsInNvY2tldCIsImluZGV4IiwiZm9yRWFjaCIsInUiLCJpIiwiaWRDb25leGlvbiIsImlkIiwiaW5kZXhPZiIsInNwbGljZSIsInNvY2tldHMiLCJlbWl0IiwidG8iLCJpZFNvY2tldFJlY2VwdG9yIiwiaWRTb2NrZXRFbWlzb3IiLCJtZW5zYWplUmVjaWJpZG8iLCJlcyJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlD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USxPQUYrQztBQUc5RGdFLFFBQUUsRUFBRXhFLEtBQUssQ0FBQ3dFO0FBSG9ELEtBQS9EO0FBS0EsR0FORDtBQU9BLENBakRELEU7Ozs7Ozs7Ozs7O0FDcENBLG1DOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLDZDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vaW5kZXguanNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG5cdGNvbnN0IGp3dCA9IHJlcXVpcmUoJ2pzb253ZWJ0b2tlbicpXHJcblx0aWYgKHJlcS5wYXRoICE9PSAnL2FwaS9sb2dpbicgJiYgcmVxLnBhdGggIT09ICcvYXBpL3VzdWFyaW8vc2luZ3VwJykge1xyXG5cdFx0aWYgKCFyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uKVxyXG5cdFx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbih7IG1lbnNhamU6ICdObyBlbnZpbyBlbCB0b2tlbiBlbiBlbCBoZWFkZXJzJywgbG9nT0s6IGZhbHNlIH0pXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc3QgdG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV1cclxuXHRcdFx0and0LnZlcmlmeSh0b2tlbiwgcHJvY2Vzcy5lbnYuU0VDUkVUX1RPS0VOLCAoZSwgZGF0b3MpID0+IHtcclxuXHRcdFx0XHRpZiAoZSkge1xyXG5cdFx0XHRcdFx0cmVzXHJcblx0XHRcdFx0XHRcdC5zdGF0dXMoMjAwKVxyXG5cdFx0XHRcdFx0XHQuanNvbih7IG1lbnNhamU6IGUubWVzc2FnZSwgb3RybzogJ2Vycm9yICBlbiBsYSBjb21tcHJvYmFjaW9uIHRva2VuJywgbG9nT0s6IGZhbHNlIH0pXHJcblx0XHRcdFx0fSBlbHNlIHJldHVybiBuZXh0KClcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9IGVsc2UgcmV0dXJuIG5leHQoKVxyXG59XHJcbiIsImNvbnN0IHsgUm91dGVyIH0gPSByZXF1aXJlKCdleHByZXNzJylcclxuY29uc3Qgcm91dGVyID0gUm91dGVyKClcclxuXHJcbnJvdXRlci5nZXQoJy8nLCAocmVxLCByZXMpID0+IHtcclxuXHRjb25zdCBqd3QgPSByZXF1aXJlKCdqc29ud2VidG9rZW4nKVxyXG5cdGNvbnN0IHRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXHJcblx0and0LnZlcmlmeSh0b2tlbiwgcHJvY2Vzcy5lbnYuU0VDUkVUX1RPS0VOLCAoZSwgZCkgPT4ge1xyXG5cdFx0ZVxyXG5cdFx0XHQ/IHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgbWVuc2FqZTogZS5uYW1lLCBsb2dPSzogZmFsc2UgfSlcclxuXHRcdFx0OiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHVzdWFyaW86IGQsIGxvZ09LOiB0cnVlIH0pXHJcblx0fSlcclxufSlcclxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXJcclxuIiwiY29uc3QgeyBSb3V0ZXIgfSA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG5jb25zdCBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKVxyXG5jb25zdCBqd3QgPSByZXF1aXJlKCdqc29ud2VidG9rZW4nKVxyXG5jb25zdCByb3V0ZXIgPSBSb3V0ZXIoKVxyXG5cclxucm91dGVyLnBvc3QoJy8nLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuXHRjb25zdCB7IGFicmlyQ29uZXhpb25QT09MLCBjZXJyYXJDb25leGlvblBPT0wgfSA9IHJlcXVpcmUoJ25wbS1jb25leGlvbi1zcWwnKVxyXG5cdGNvbnN0IHsgZW1haWxVc3VhcmlvLCBwd1VzdWFyaW8gfSA9IHJlcS5ib2R5XHJcblx0Y29uc3QgeyBSZXF1ZXN0LCBWYXJDaGFyIH0gPSByZXF1aXJlKCdtc3NxbCcpXHJcblx0dHJ5IHtcclxuXHRcdGNvbnN0IGNvbmV4aW9uID0gYXdhaXQgYWJyaXJDb25leGlvblBPT0woJ2xvZ3Vlb1VzdWFyaW8nKVxyXG5cdFx0Y29uc3QgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoY29uZXhpb24pXHJcblx0XHRteVJlcXVlc3QuaW5wdXQoJ2VtYWlsVXN1YXJpbycsIFZhckNoYXIsIGVtYWlsVXN1YXJpbylcclxuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IG15UmVxdWVzdC5leGVjdXRlKCdwYV9sb2dpbicpXHJcblx0XHRpZiAocmVzdWx0KSB7XHJcblx0XHRcdGNlcnJhckNvbmV4aW9uUE9PTCgpXHJcblx0XHRcdGlmIChyZXN1bHQucm93c0FmZmVjdGVkWzBdID09PSAwKVxyXG5cdFx0XHRcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgbWVuc2FqZTogJ1VzdWFyaW8gaW5leGlzdGVudGUgJywgbG9nT0s6IGZhbHNlIH0pXHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGlmICghYmNyeXB0LmNvbXBhcmVTeW5jKHB3VXN1YXJpbywgcmVzdWx0LnJlY29yZHNldFswXS5wd1VzdWFyaW8pKSB7XHJcblx0XHRcdFx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbih7IG1lbnNhamU6ICdQYXNzd29yZCBpbmNvcnJlY3RhICcsIGxvZ09LOiBmYWxzZSB9KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zdCB1c2VyID0ge1xyXG5cdFx0XHRcdFx0XHRpZFVzdWFyaW86IHJlc3VsdC5yZWNvcmRzZXRbMF0uaWRVc3VhcmlvLFxyXG5cdFx0XHRcdFx0XHRlbWFpbFVzdWFyaW86IHJlc3VsdC5yZWNvcmRzZXRbMF0uZW1haWxVc3VhcmlvLFxyXG5cdFx0XHRcdFx0XHRub21icmVVc3VhcmlvOiByZXN1bHQucmVjb3Jkc2V0WzBdLm5vbWJyZVVzdWFyaW8sXHJcblx0XHRcdFx0XHRcdGFwZWxsaWRvVXN1YXJpbzogcmVzdWx0LnJlY29yZHNldFswXS5hcGVsbGlkb1VzdWFyaW8sXHJcblx0XHRcdFx0XHRcdGlkUGVyZmlsOiByZXN1bHQucmVjb3Jkc2V0WzBdLmlkUGVyZmlsLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0and0LnNpZ24odXNlciwgcHJvY2Vzcy5lbnYuU0VDUkVUX1RPS0VOLCB7IGV4cGlyZXNJbjogMTQ0MDAgfSwgKGVycm9yLCB0b2tlbikgPT4ge1xyXG5cdFx0XHRcdFx0XHRlcnJvclxyXG5cdFx0XHRcdFx0XHRcdD8gcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZW5zYWplOiAnRXJyb3IgYWwgZ2VuZXJhciBlbCB0b2tlbicsIGxvZ09LOiBmYWxzZSB9KVxyXG5cdFx0XHRcdFx0XHRcdDogcmVzLnN0YXR1cygyMDApLmpzb24oeyB0b2tlbiwgbG9nT0s6IHRydWUgfSlcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjZXJyYXJDb25leGlvblBPT0woKVxyXG5cdFx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbihyZXN1bHQpXHJcblx0XHR9XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0Y2VycmFyQ29uZXhpb25QT09MKClcclxuXHRcdGNvbnNvbGUubG9nKGUpXHJcblx0XHRyZXMuc3RhdHVzKDQwMykuanNvbih7IGxvZ09LOiBmYWxzZSwgbWVuc2FqZTogZS5tZXNzYWdlIH0pXHJcblx0fVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXJcclxuIiwiY29uc3QgeyBSb3V0ZXIgfSA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG5cclxuY29uc3Qgcm91dGVyID0gUm91dGVyKClcclxuXHJcbnJvdXRlci5wb3N0KCcvc2luZ3VwJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcblx0Y29uc3QgeyBhYnJpckNvbmV4aW9uUE9PTCwgY2VycmFyQ29uZXhpb25QT09MIH0gPSByZXF1aXJlKCducG0tY29uZXhpb24tc3FsJylcclxuXHRjb25zdCB7IFJlcXVlc3QsIFZhckNoYXIgfSA9IHJlcXVpcmUoJ21zc3FsJylcclxuXHRjb25zdCBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKVxyXG5cdGNvbnN0IHsgZW1haWxVc3VhcmlvLCBwd1VzdWFyaW8sIG5vbWJyZVVzdWFyaW8sIGFwZWxsaWRvVXN1YXJpbyB9ID0gcmVxLmJvZHlcclxuXHJcblx0dHJ5IHtcclxuXHRcdGNvbnN0IGNvbmV4aW9uID0gYXdhaXQgYWJyaXJDb25leGlvblBPT0woJ3Npbmd1cCcpXHJcblx0XHRjb25zdCBteVJlcXVlcyA9IG5ldyBSZXF1ZXN0KGNvbmV4aW9uKVxyXG5cdFx0bXlSZXF1ZXMuaW5wdXQoJ2VtYWlsVXN1YXJpbycsIFZhckNoYXIsIGVtYWlsVXN1YXJpbylcclxuXHRcdG15UmVxdWVzLmlucHV0KCdwd1VzdWFyaW8nLCBWYXJDaGFyLCBiY3J5cHQuaGFzaFN5bmMocHdVc3VhcmlvLCAxMCkpXHJcblx0XHRteVJlcXVlcy5pbnB1dCgnbm9tYnJlVXN1YXJpbycsIFZhckNoYXIsIG5vbWJyZVVzdWFyaW8pXHJcblx0XHRteVJlcXVlcy5pbnB1dCgnYXBlbGxpZG9Vc3VhcmlvJywgVmFyQ2hhciwgYXBlbGxpZG9Vc3VhcmlvKVxyXG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgbXlSZXF1ZXMuZXhlY3V0ZSgncGFfc2luZ3VwJylcclxuXHRcdGlmIChyZXN1bHQpIHtcclxuXHRcdFx0Y2VycmFyQ29uZXhpb25QT09MKClcclxuXHRcdFx0aWYgKHJlc3VsdC5yZWNvcmRzZXRbMF0uT0spXHJcblx0XHRcdFx0cmVzLnN0YXR1cygyMDApLmpzb24oeyBvcE9LOiB0cnVlLCBtZW5zYWplOiByZXN1bHQucmVjb3Jkc2V0WzBdLk9LIH0pXHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgb3BPSzogZmFsc2UsIG1lbnNhamU6IHJlc3VsdC5yZWNvcmRzZXRbMF0ubm9PSyB9KVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0Y2VycmFyQ29uZXhpb25QT09MKClcclxuXHRcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgb3BPSzogZmFsc2UsIG1lbnNhamU6IGUubWVzc2FnZSB9KVxyXG5cdH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyXHJcbiIsImNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJylcclxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG5jb25zdCBjb3JzID0gcmVxdWlyZSgnY29ycycpXHJcbmNvbnN0IG1vcmdhbiA9IHJlcXVpcmUoJ21vcmdhbicpXHJcbmNvbnN0IFNvY2tldElPID0gcmVxdWlyZSgnc29ja2V0LmlvJylcclxudmFyIHZlY0NvbmVjdCA9IFtdXHJcblxyXG5yZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKVxyXG5cclxuY29uc3Qgc2Vydmlkb3IgPSBleHByZXNzKClcclxuXHJcbnNlcnZpZG9yLnVzZShjb3JzKCkpXHJcbnNlcnZpZG9yLnVzZShleHByZXNzLmpzb24oKSlcclxuc2Vydmlkb3IudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSlcclxuc2Vydmlkb3IudXNlKG1vcmdhbignZGV2JykpXHJcblxyXG5zZXJ2aWRvci5zZXQoJ3BvcnQnLCBwcm9jZXNzLmVudi5QT1JUIHx8IDUwMDApXHJcblxyXG4vL1RPRE86IE1JRERFTFdBUkVcclxuc2Vydmlkb3IudXNlKHJlcXVpcmUoJy4vUk9VVEVSL2NoZWNrTG9naW4nKSlcclxuc2Vydmlkb3IudXNlKCcvYXBpL2xvZ2luJywgcmVxdWlyZSgnLi9ST1VURVIvbG9naW4nKSlcclxuc2Vydmlkb3IudXNlKCcvYXBpL2dldHVzZXJsb2dpbicsIHJlcXVpcmUoJy4vUk9VVEVSL2dldFVzZXJMb2dpbicpKVxyXG5zZXJ2aWRvci51c2UoJy9hcGkvdXN1YXJpbycsIHJlcXVpcmUoJy4vUk9VVEVSL3VzdWFyaW9zJykpXHJcblxyXG5jb25zdCBteVNlcnZlckV4cHJlc3MgPSBzZXJ2aWRvci5saXN0ZW4oc2Vydmlkb3IuZ2V0KCdwb3J0JyksIGUgPT4ge1xyXG5cdGlmIChlKSBjb25zb2xlLmVycm9yKGUpXHJcblx0ZWxzZSB7XHJcblx0XHR2ZWNDb25lY3QgPSBbXVxyXG5cdFx0Y29uc29sZS5sb2coJ0NvbmVjdGFkbyBlbiBlbCBwdWVydG8gNTAwMCcpXHJcblx0fVxyXG59KVxyXG5cclxuLy9UT0RPOiBXRUJTT0NLRVRcclxuXHJcbmNvbnN0IGlvID0gU29ja2V0SU8ubGlzdGVuKG15U2VydmVyRXhwcmVzcylcclxuXHJcbmlvLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcclxuXHRzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCB1c2VyID0+IHtcclxuXHRcdHZhciBpbmRleCA9IC0xXHJcblx0XHR2ZWNDb25lY3QuZm9yRWFjaCgodSwgaSkgPT4ge1xyXG5cdFx0XHRpZiAodS5pZENvbmV4aW9uID09PSBzb2NrZXQuaWQpIHtcclxuXHRcdFx0XHRpbmRleCA9IHZlY0NvbmVjdC5pbmRleE9mKHUpXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHRpZiAoaW5kZXggIT09IC0xKSB7XHJcblx0XHRcdHZlY0NvbmVjdC5zcGxpY2UoaW5kZXgsIDEpXHJcblx0XHRcdGlvLnNvY2tldHMuZW1pdCgndXBkYXRlQ29uZWN0JywgdmVjQ29uZWN0KVxyXG5cdFx0fVxyXG5cdH0pXHJcblx0c29ja2V0Lm9uKCdzZW5kVXNlckNvbmVjdGVkJywgdXN1YXJpbyA9PiB7XHJcblx0XHR2YXIgaW5kZXggPSAtMVxyXG5cdFx0dmVjQ29uZWN0LmZvckVhY2goKHUsIGkpID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRpZiAodS51c3VhcmlvLmVtYWlsVXN1YXJpbyA9PT0gdXN1YXJpby5lbWFpbFVzdWFyaW8pIHtcclxuXHRcdFx0XHRcdGluZGV4ID0gaVxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0aW5kZXggPSAtMVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdGluZGV4ICE9PSAtMSAmJiB2ZWNDb25lY3Quc3BsaWNlKGluZGV4LCAxKVxyXG5cclxuXHRcdHZlY0NvbmVjdCA9IFsuLi52ZWNDb25lY3QsIHsgaWRDb25leGlvbjogc29ja2V0LmlkLCB1c3VhcmlvOiB1c3VhcmlvIH1dXHJcblx0XHRpby5zb2NrZXRzLmVtaXQoJ3VwZGF0ZUNvbmVjdCcsIHZlY0NvbmVjdClcclxuXHR9KVxyXG5cclxuXHRzb2NrZXQub24oJ2Vudmlhck1zajpyZWFjdC1ub2RlJywgZGF0b3MgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2coZGF0b3MpXHJcblx0XHRzb2NrZXQudG8oZGF0b3MuaWRTb2NrZXRSZWNlcHRvcikuZW1pdCgncmVzaWJpck1zajpub2RlLXJlYWN0Jywge1xyXG5cdFx0XHRpZFNvY2tldEVtaXNvcjogc29ja2V0LmlkLFxyXG5cdFx0XHR1c3VhcmlvOiBkYXRvcy51c3VhcmlvLFxyXG5cdFx0XHRtZW5zYWplUmVjaWJpZG86IGRhdG9zLm1lbnNhamUsXHJcblx0XHR9KVxyXG5cdH0pXHJcblxyXG5cdHNvY2tldC5vbignZXNjcmliaWVuZG86cmVhY3Qtbm9kZScsIGRhdG9zID0+IHtcclxuXHRcdHNvY2tldC50byhkYXRvcy5pZFNvY2tldEVtaXNvcikuZW1pdCgnZXNjcmliaWVuZG86bm9kZS1yZWFjdCcsIHtcclxuXHRcdFx0aWRTb2NrZXRFbWlzb3I6IHNvY2tldC5pZCxcclxuXHRcdFx0dXN1YXJpbzogZGF0b3MudXN1YXJpbyxcclxuXHRcdFx0ZXM6IGRhdG9zLmVzLFxyXG5cdFx0fSlcclxuXHR9KVxyXG59KVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiY3J5cHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9yZ2FuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1zc3FsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5wbS1jb25leGlvbi1zcWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==