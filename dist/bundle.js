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
    if (!req.headers.authorization) {
      res.status(200).json({
        mensaje: 'No envio el token en el headers',
        logOK: false
      });
    } else {
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
        opOK: false
      });else {
        if (!bcrypt.compareSync(pwUsuario, result.recordset[0].pwUsuario)) {
          res.status(200).json({
            mensaje: 'Password incorrecta ',
            opOK: false
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
              opOK: false
            }) : res.status(200).json({
              token,
              opOK: true
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
    res.status(403).json({
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
servidor.use(__webpack_require__(/*! ./ROUTER/getUserLogin */ "./ROUTER/getUserLogin.js"));
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
  socket.on('sendUserConected', nameUser => {
    vecConect = [...vecConect, {
      idConexion: socket.id,
      nombreUsuario: nameUser
    }];
    io.sockets.emit('updateConect', vecConect);
  });
  socket.on('enviarMsj:react-node', datos => {
    socket.to(datos.idSocketReceptor).emit('resibirMsj:node-react', {
      idSocketEmisor: socket.id,
      nombreEmisor: datos.nombre,
      mensajeRecibido: datos.mensaje
    });
  });
  socket.on('escribiendo:react-node', datos => {
    socket.to(datos.idSocketEmisor).emit('escribiendo:node-react', {
      idSocketEmisor: socket.id,
      nombreEmisor: datos.nameUser,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vUk9VVEVSL2NoZWNrTG9naW4uanMiLCJ3ZWJwYWNrOi8vLy4vUk9VVEVSL2dldFVzZXJMb2dpbi5qcyIsIndlYnBhY2s6Ly8vLi9ST1VURVIvbG9naW4uanMiLCJ3ZWJwYWNrOi8vLy4vUk9VVEVSL3VzdWFyaW9zLmpzIiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImJjcnlwdFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvcnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkb3RlbnZcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9yZ2FuXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibXNzcWxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJucG0tY29uZXhpb24tc3FsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJyZXEiLCJyZXMiLCJuZXh0Iiwiand0IiwicmVxdWlyZSIsInBhdGgiLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsInN0YXR1cyIsImpzb24iLCJtZW5zYWplIiwibG9nT0siLCJ0b2tlbiIsInNwbGl0IiwidmVyaWZ5IiwicHJvY2VzcyIsImVudiIsIlNFQ1JFVF9UT0tFTiIsImUiLCJkYXRvcyIsIm1lc3NhZ2UiLCJvdHJvIiwiUm91dGVyIiwicm91dGVyIiwiZ2V0IiwiZCIsIm5hbWUiLCJ1c3VhcmlvIiwiYmNyeXB0IiwicG9zdCIsImFicmlyQ29uZXhpb25QT09MIiwiY2VycmFyQ29uZXhpb25QT09MIiwiZW1haWxVc3VhcmlvIiwicHdVc3VhcmlvIiwiYm9keSIsIlJlcXVlc3QiLCJWYXJDaGFyIiwiY29uZXhpb24iLCJteVJlcXVlc3QiLCJpbnB1dCIsInJlc3VsdCIsImV4ZWN1dGUiLCJyb3dzQWZmZWN0ZWQiLCJvcE9LIiwiY29tcGFyZVN5bmMiLCJyZWNvcmRzZXQiLCJ1c2VyIiwiaWRVc3VhcmlvIiwibm9tYnJlVXN1YXJpbyIsImFwZWxsaWRvVXN1YXJpbyIsImlkUGVyZmlsIiwic2lnbiIsImV4cGlyZXNJbiIsImVycm9yIiwibXlSZXF1ZXMiLCJoYXNoU3luYyIsIk9LIiwibm9PSyIsImV4cHJlc3MiLCJjb3JzIiwibW9yZ2FuIiwiU29ja2V0SU8iLCJ2ZWNDb25lY3QiLCJjb25maWciLCJzZXJ2aWRvciIsInVzZSIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInNldCIsIlBPUlQiLCJteVNlcnZlckV4cHJlc3MiLCJsaXN0ZW4iLCJjb25zb2xlIiwibG9nIiwiaW8iLCJvbiIsInNvY2tldCIsImluZGV4IiwiZm9yRWFjaCIsInUiLCJpIiwiaWRDb25leGlvbiIsImlkIiwiaW5kZXhPZiIsInNwbGljZSIsInNvY2tldHMiLCJlbWl0IiwibmFtZVVzZXIiLCJ0byIsImlkU29ja2V0UmVjZXB0b3IiLCJpZFNvY2tldEVtaXNvciIsIm5vbWJyZUVtaXNvciIsIm5vbWJyZSIsIm1lbnNhamVSZWNpYmlkbyIsImVzIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtR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QUFoQixFQUFnQ3hCLFNBQWhDO0FBQ0EsR0FIRDtBQUtBYyxRQUFNLENBQUNELEVBQVAsQ0FBVSxzQkFBVixFQUFrQ3hELEtBQUssSUFBSTtBQUMxQ3lELFVBQU0sQ0FBQ1ksRUFBUCxDQUFVckUsS0FBSyxDQUFDc0UsZ0JBQWhCLEVBQWtDSCxJQUFsQyxDQUF1Qyx1QkFBdkMsRUFBZ0U7QUFDL0RJLG9CQUFjLEVBQUVkLE1BQU0sQ0FBQ00sRUFEd0M7QUFFL0RTLGtCQUFZLEVBQUV4RSxLQUFLLENBQUN5RSxNQUYyQztBQUcvREMscUJBQWUsRUFBRTFFLEtBQUssQ0FBQ1Q7QUFId0MsS0FBaEU7QUFLQSxHQU5EO0FBUUFrRSxRQUFNLENBQUNELEVBQVAsQ0FBVSx3QkFBVixFQUFvQ3hELEtBQUssSUFBSTtBQUM1Q3lELFVBQU0sQ0FBQ1ksRUFBUCxDQUFVckUsS0FBSyxDQUFDdUUsY0FBaEIsRUFBZ0NKLElBQWhDLENBQXFDLHdCQUFyQyxFQUErRDtBQUM5REksb0JBQWMsRUFBRWQsTUFBTSxDQUFDTSxFQUR1QztBQUU5RFMsa0JBQVksRUFBRXhFLEtBQUssQ0FBQ29FLFFBRjBDO0FBRzlETyxRQUFFLEVBQUUzRSxLQUFLLENBQUMyRTtBQUhvRCxLQUEvRDtBQUtBLEdBTkQ7QUFPQSxDQWxDRCxFOzs7Ozs7Ozs7OztBQ3BDQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSx5Qzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSw2Qzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2luZGV4LmpzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcclxuXHRjb25zdCBqd3QgPSByZXF1aXJlKCdqc29ud2VidG9rZW4nKVxyXG5cdGlmIChyZXEucGF0aCAhPT0gJy9hcGkvbG9naW4nICYmIHJlcS5wYXRoICE9PSAnL2FwaS91c3VhcmlvL3Npbmd1cCcpIHtcclxuXHRcdGlmICghcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbikge1xyXG5cdFx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbih7IG1lbnNhamU6ICdObyBlbnZpbyBlbCB0b2tlbiBlbiBlbCBoZWFkZXJzJywgbG9nT0s6IGZhbHNlIH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zdCB0b2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXVxyXG5cdFx0XHRqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5TRUNSRVRfVE9LRU4sIChlLCBkYXRvcykgPT4ge1xyXG5cdFx0XHRcdGlmIChlKSB7XHJcblx0XHRcdFx0XHRyZXNcclxuXHRcdFx0XHRcdFx0LnN0YXR1cygyMDApXHJcblx0XHRcdFx0XHRcdC5qc29uKHsgbWVuc2FqZTogZS5tZXNzYWdlLCBvdHJvOiAnZXJyb3IgIGVuIGxhIGNvbW1wcm9iYWNpb24gdG9rZW4nLCBsb2dPSzogZmFsc2UgfSlcclxuXHRcdFx0XHR9IGVsc2UgcmV0dXJuIG5leHQoKVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH0gZWxzZSByZXR1cm4gbmV4dCgpXHJcbn1cclxuIiwiY29uc3QgeyBSb3V0ZXIgfSA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG5jb25zdCByb3V0ZXIgPSBSb3V0ZXIoKVxyXG5cclxucm91dGVyLmdldCgnLycsIChyZXEsIHJlcykgPT4ge1xyXG5cdGNvbnN0IGp3dCA9IHJlcXVpcmUoJ2pzb253ZWJ0b2tlbicpXHJcblx0Y29uc3QgdG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV1cclxuXHRqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5TRUNSRVRfVE9LRU4sIChlLCBkKSA9PiB7XHJcblx0XHRlXHJcblx0XHRcdD8gcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZW5zYWplOiBlLm5hbWUsIGxvZ09LOiBmYWxzZSB9KVxyXG5cdFx0XHQ6IHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgdXN1YXJpbzogZCwgbG9nT0s6IHRydWUgfSlcclxuXHR9KVxyXG59KVxyXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlclxyXG4iLCJjb25zdCB7IFJvdXRlciB9ID0gcmVxdWlyZSgnZXhwcmVzcycpXHJcbmNvbnN0IGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdCcpXHJcbmNvbnN0IGp3dCA9IHJlcXVpcmUoJ2pzb253ZWJ0b2tlbicpXHJcbmNvbnN0IHJvdXRlciA9IFJvdXRlcigpXHJcblxyXG5yb3V0ZXIucG9zdCgnLycsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG5cdGNvbnN0IHsgYWJyaXJDb25leGlvblBPT0wsIGNlcnJhckNvbmV4aW9uUE9PTCB9ID0gcmVxdWlyZSgnbnBtLWNvbmV4aW9uLXNxbCcpXHJcblx0Y29uc3QgeyBlbWFpbFVzdWFyaW8sIHB3VXN1YXJpbyB9ID0gcmVxLmJvZHlcclxuXHRjb25zdCB7IFJlcXVlc3QsIFZhckNoYXIgfSA9IHJlcXVpcmUoJ21zc3FsJylcclxuXHR0cnkge1xyXG5cdFx0Y29uc3QgY29uZXhpb24gPSBhd2FpdCBhYnJpckNvbmV4aW9uUE9PTCgnbG9ndWVvVXN1YXJpbycpXHJcblx0XHRjb25zdCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChjb25leGlvbilcclxuXHRcdG15UmVxdWVzdC5pbnB1dCgnZW1haWxVc3VhcmlvJywgVmFyQ2hhciwgZW1haWxVc3VhcmlvKVxyXG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgbXlSZXF1ZXN0LmV4ZWN1dGUoJ3BhX2xvZ2luJylcclxuXHRcdGlmIChyZXN1bHQpIHtcclxuXHRcdFx0Y2VycmFyQ29uZXhpb25QT09MKClcclxuXHRcdFx0aWYgKHJlc3VsdC5yb3dzQWZmZWN0ZWRbMF0gPT09IDApXHJcblx0XHRcdFx0cmVzLnN0YXR1cygyMDApLmpzb24oeyBtZW5zYWplOiAnVXN1YXJpbyBpbmV4aXN0ZW50ZSAnLCBvcE9LOiBmYWxzZSB9KVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpZiAoIWJjcnlwdC5jb21wYXJlU3luYyhwd1VzdWFyaW8sIHJlc3VsdC5yZWNvcmRzZXRbMF0ucHdVc3VhcmlvKSkge1xyXG5cdFx0XHRcdFx0cmVzLnN0YXR1cygyMDApLmpzb24oeyBtZW5zYWplOiAnUGFzc3dvcmQgaW5jb3JyZWN0YSAnLCBvcE9LOiBmYWxzZSB9KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zdCB1c2VyID0ge1xyXG5cdFx0XHRcdFx0XHRpZFVzdWFyaW86IHJlc3VsdC5yZWNvcmRzZXRbMF0uaWRVc3VhcmlvLFxyXG5cdFx0XHRcdFx0XHRlbWFpbFVzdWFyaW86IHJlc3VsdC5yZWNvcmRzZXRbMF0uZW1haWxVc3VhcmlvLFxyXG5cdFx0XHRcdFx0XHRub21icmVVc3VhcmlvOiByZXN1bHQucmVjb3Jkc2V0WzBdLm5vbWJyZVVzdWFyaW8sXHJcblx0XHRcdFx0XHRcdGFwZWxsaWRvVXN1YXJpbzogcmVzdWx0LnJlY29yZHNldFswXS5hcGVsbGlkb1VzdWFyaW8sXHJcblx0XHRcdFx0XHRcdGlkUGVyZmlsOiByZXN1bHQucmVjb3Jkc2V0WzBdLmlkUGVyZmlsLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0and0LnNpZ24odXNlciwgcHJvY2Vzcy5lbnYuU0VDUkVUX1RPS0VOLCB7IGV4cGlyZXNJbjogMTQ0MDAgfSwgKGVycm9yLCB0b2tlbikgPT4ge1xyXG5cdFx0XHRcdFx0XHRlcnJvclxyXG5cdFx0XHRcdFx0XHRcdD8gcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZW5zYWplOiAnRXJyb3IgYWwgZ2VuZXJhciBlbCB0b2tlbicsIG9wT0s6IGZhbHNlIH0pXHJcblx0XHRcdFx0XHRcdFx0OiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHRva2VuLCBvcE9LOiB0cnVlIH0pXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2VycmFyQ29uZXhpb25QT09MKClcclxuXHRcdFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmVzdWx0KVxyXG5cdFx0fVxyXG5cdH0gY2F0Y2ggKGUpIHtcclxuXHRcdGNlcnJhckNvbmV4aW9uUE9PTCgpXHJcblx0XHRyZXMuc3RhdHVzKDQwMykuanNvbih7IG1lbnNhamU6IGUubWVzc2FnZSB9KVxyXG5cdH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyXHJcbiIsImNvbnN0IHsgUm91dGVyIH0gPSByZXF1aXJlKCdleHByZXNzJylcclxuXHJcbmNvbnN0IHJvdXRlciA9IFJvdXRlcigpXHJcblxyXG5yb3V0ZXIucG9zdCgnL3Npbmd1cCcsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG5cdGNvbnN0IHsgYWJyaXJDb25leGlvblBPT0wsIGNlcnJhckNvbmV4aW9uUE9PTCB9ID0gcmVxdWlyZSgnbnBtLWNvbmV4aW9uLXNxbCcpXHJcblx0Y29uc3QgeyBSZXF1ZXN0LCBWYXJDaGFyIH0gPSByZXF1aXJlKCdtc3NxbCcpXHJcblx0Y29uc3QgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0JylcclxuXHRjb25zdCB7IGVtYWlsVXN1YXJpbywgcHdVc3VhcmlvLCBub21icmVVc3VhcmlvLCBhcGVsbGlkb1VzdWFyaW8gfSA9IHJlcS5ib2R5XHJcblxyXG5cdHRyeSB7XHJcblx0XHRjb25zdCBjb25leGlvbiA9IGF3YWl0IGFicmlyQ29uZXhpb25QT09MKCdzaW5ndXAnKVxyXG5cdFx0Y29uc3QgbXlSZXF1ZXMgPSBuZXcgUmVxdWVzdChjb25leGlvbilcclxuXHRcdG15UmVxdWVzLmlucHV0KCdlbWFpbFVzdWFyaW8nLCBWYXJDaGFyLCBlbWFpbFVzdWFyaW8pXHJcblx0XHRteVJlcXVlcy5pbnB1dCgncHdVc3VhcmlvJywgVmFyQ2hhciwgYmNyeXB0Lmhhc2hTeW5jKHB3VXN1YXJpbywgMTApKVxyXG5cdFx0bXlSZXF1ZXMuaW5wdXQoJ25vbWJyZVVzdWFyaW8nLCBWYXJDaGFyLCBub21icmVVc3VhcmlvKVxyXG5cdFx0bXlSZXF1ZXMuaW5wdXQoJ2FwZWxsaWRvVXN1YXJpbycsIFZhckNoYXIsIGFwZWxsaWRvVXN1YXJpbylcclxuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IG15UmVxdWVzLmV4ZWN1dGUoJ3BhX3Npbmd1cCcpXHJcblx0XHRpZiAocmVzdWx0KSB7XHJcblx0XHRcdGNlcnJhckNvbmV4aW9uUE9PTCgpXHJcblx0XHRcdGlmIChyZXN1bHQucmVjb3Jkc2V0WzBdLk9LKVxyXG5cdFx0XHRcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgb3BPSzogdHJ1ZSwgbWVuc2FqZTogcmVzdWx0LnJlY29yZHNldFswXS5PSyB9KVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbih7IG9wT0s6IGZhbHNlLCBtZW5zYWplOiByZXN1bHQucmVjb3Jkc2V0WzBdLm5vT0sgfSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0gY2F0Y2ggKGUpIHtcclxuXHRcdGNlcnJhckNvbmV4aW9uUE9PTCgpXHJcblx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbih7IG9wT0s6IGZhbHNlLCBtZW5zYWplOiBlLm1lc3NhZ2UgfSlcclxuXHR9XHJcbn0pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlclxyXG4iLCJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpXHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuY29uc3QgY29ycyA9IHJlcXVpcmUoJ2NvcnMnKVxyXG5jb25zdCBtb3JnYW4gPSByZXF1aXJlKCdtb3JnYW4nKVxyXG5jb25zdCBTb2NrZXRJTyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpXHJcbnZhciB2ZWNDb25lY3QgPSBbXVxyXG5cclxucmVxdWlyZSgnZG90ZW52JykuY29uZmlnKClcclxuXHJcbmNvbnN0IHNlcnZpZG9yID0gZXhwcmVzcygpXHJcblxyXG5zZXJ2aWRvci51c2UoY29ycygpKVxyXG5zZXJ2aWRvci51c2UoZXhwcmVzcy5qc29uKCkpXHJcbnNlcnZpZG9yLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpXHJcbnNlcnZpZG9yLnVzZShtb3JnYW4oJ2RldicpKVxyXG5cclxuc2Vydmlkb3Iuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCA1MDAwKVxyXG5cclxuLy9UT0RPOiBNSURERUxXQVJFXHJcbnNlcnZpZG9yLnVzZShyZXF1aXJlKCcuL1JPVVRFUi9jaGVja0xvZ2luJykpXHJcbnNlcnZpZG9yLnVzZSgnL2FwaS9sb2dpbicsIHJlcXVpcmUoJy4vUk9VVEVSL2xvZ2luJykpXHJcbnNlcnZpZG9yLnVzZShyZXF1aXJlKCcuL1JPVVRFUi9nZXRVc2VyTG9naW4nKSlcclxuc2Vydmlkb3IudXNlKCcvYXBpL3VzdWFyaW8nLCByZXF1aXJlKCcuL1JPVVRFUi91c3VhcmlvcycpKVxyXG5cclxuY29uc3QgbXlTZXJ2ZXJFeHByZXNzID0gc2Vydmlkb3IubGlzdGVuKHNlcnZpZG9yLmdldCgncG9ydCcpLCBlID0+IHtcclxuXHRpZiAoZSkgY29uc29sZS5lcnJvcihlKVxyXG5cdGVsc2Uge1xyXG5cdFx0dmVjQ29uZWN0ID0gW11cclxuXHRcdGNvbnNvbGUubG9nKCdDb25lY3RhZG8gZW4gZWwgcHVlcnRvIDUwMDAnKVxyXG5cdH1cclxufSlcclxuXHJcbi8vVE9ETzogV0VCU09DS0VUXHJcblxyXG5jb25zdCBpbyA9IFNvY2tldElPLmxpc3RlbihteVNlcnZlckV4cHJlc3MpXHJcblxyXG5pby5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XHJcblx0c29ja2V0Lm9uKCdkaXNjb25uZWN0JywgdXNlciA9PiB7XHJcblx0XHR2YXIgaW5kZXggPSAtMVxyXG5cdFx0dmVjQ29uZWN0LmZvckVhY2goKHUsIGkpID0+IHtcclxuXHRcdFx0aWYgKHUuaWRDb25leGlvbiA9PT0gc29ja2V0LmlkKSB7XHJcblx0XHRcdFx0aW5kZXggPSB2ZWNDb25lY3QuaW5kZXhPZih1KVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0aWYgKGluZGV4ICE9PSAtMSkge1xyXG5cdFx0XHR2ZWNDb25lY3Quc3BsaWNlKGluZGV4LCAxKVxyXG5cdFx0XHRpby5zb2NrZXRzLmVtaXQoJ3VwZGF0ZUNvbmVjdCcsIHZlY0NvbmVjdClcclxuXHRcdH1cclxuXHR9KVxyXG5cdHNvY2tldC5vbignc2VuZFVzZXJDb25lY3RlZCcsIG5hbWVVc2VyID0+IHtcclxuXHRcdHZlY0NvbmVjdCA9IFsuLi52ZWNDb25lY3QsIHsgaWRDb25leGlvbjogc29ja2V0LmlkLCBub21icmVVc3VhcmlvOiBuYW1lVXNlciB9XVxyXG5cdFx0aW8uc29ja2V0cy5lbWl0KCd1cGRhdGVDb25lY3QnLCB2ZWNDb25lY3QpXHJcblx0fSlcclxuXHJcblx0c29ja2V0Lm9uKCdlbnZpYXJNc2o6cmVhY3Qtbm9kZScsIGRhdG9zID0+IHtcclxuXHRcdHNvY2tldC50byhkYXRvcy5pZFNvY2tldFJlY2VwdG9yKS5lbWl0KCdyZXNpYmlyTXNqOm5vZGUtcmVhY3QnLCB7XHJcblx0XHRcdGlkU29ja2V0RW1pc29yOiBzb2NrZXQuaWQsXHJcblx0XHRcdG5vbWJyZUVtaXNvcjogZGF0b3Mubm9tYnJlLFxyXG5cdFx0XHRtZW5zYWplUmVjaWJpZG86IGRhdG9zLm1lbnNhamUsXHJcblx0XHR9KVxyXG5cdH0pXHJcblxyXG5cdHNvY2tldC5vbignZXNjcmliaWVuZG86cmVhY3Qtbm9kZScsIGRhdG9zID0+IHtcclxuXHRcdHNvY2tldC50byhkYXRvcy5pZFNvY2tldEVtaXNvcikuZW1pdCgnZXNjcmliaWVuZG86bm9kZS1yZWFjdCcsIHtcclxuXHRcdFx0aWRTb2NrZXRFbWlzb3I6IHNvY2tldC5pZCxcclxuXHRcdFx0bm9tYnJlRW1pc29yOiBkYXRvcy5uYW1lVXNlcixcclxuXHRcdFx0ZXM6IGRhdG9zLmVzLFxyXG5cdFx0fSlcclxuXHR9KVxyXG59KVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiY3J5cHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9yZ2FuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1zc3FsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5wbS1jb25leGlvbi1zcWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==