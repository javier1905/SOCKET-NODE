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
servidor.set('port', process.env.PORT || 5000);
const myServerExpress = servidor.listen(servidor.get('port'), e => {
  if (e) {
    console.error(e);
  } else {
    vecConect = [];
    console.log('Conectado en el puerto 5000');
  }
}); //TODO: WEBSOCKET

const io = SocketIO.listen(myServerExpress);
io.on('connection', socket => {
  // console.log(socket.id)
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
  }); // socket.on('abrirConversacion', dato => {
  // 	socket.to(dato.idConexion).emit('abrirConversa', {})
  // })
  // console.log(vecConect)
});

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

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRvdGVudlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic29ja2V0LmlvXCIiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJwYXRoIiwiY29ycyIsIm1vcmdhbiIsIlNvY2tldElPIiwidmVjQ29uZWN0IiwiY29uZmlnIiwic2Vydmlkb3IiLCJ1c2UiLCJqc29uIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwic2V0IiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJteVNlcnZlckV4cHJlc3MiLCJsaXN0ZW4iLCJnZXQiLCJlIiwiY29uc29sZSIsImVycm9yIiwibG9nIiwiaW8iLCJvbiIsInNvY2tldCIsInVzZXIiLCJpbmRleCIsImZvckVhY2giLCJ1IiwiaSIsImlkQ29uZXhpb24iLCJpZCIsImluZGV4T2YiLCJzcGxpY2UiLCJzb2NrZXRzIiwiZW1pdCIsIm5hbWVVc2VyIiwibm9tYnJlVXN1YXJpbyIsImRhdG9zIiwidG8iLCJpZFNvY2tldFJlY2VwdG9yIiwiaWRTb2NrZXRFbWlzb3IiLCJub21icmVFbWlzb3IiLCJub21icmUiLCJtZW5zYWplUmVjaWJpZG8iLCJtZW5zYWplIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFD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UUFBUSxJQUFJO0FBQ3pDaEMsYUFBUyxHQUFHLENBQUMsR0FBR0EsU0FBSixFQUFlO0FBQUUwQixnQkFBVSxFQUFFTixNQUFNLENBQUNPLEVBQXJCO0FBQXlCTSxtQkFBYSxFQUFFRDtBQUF4QyxLQUFmLENBQVo7QUFDQWQsTUFBRSxDQUFDWSxPQUFILENBQVdDLElBQVgsQ0FBZ0IsY0FBaEIsRUFBZ0MvQixTQUFoQztBQUNBLEdBSEQ7QUFLQW9CLFFBQU0sQ0FBQ0QsRUFBUCxDQUFVLHNCQUFWLEVBQWtDZSxLQUFLLElBQUk7QUFDMUNkLFVBQU0sQ0FBQ2UsRUFBUCxDQUFVRCxLQUFLLENBQUNFLGdCQUFoQixFQUFrQ0wsSUFBbEMsQ0FBdUMsdUJBQXZDLEVBQWdFO0FBQy9ETSxvQkFBYyxFQUFFakIsTUFBTSxDQUFDTyxFQUR3QztBQUUvRFcsa0JBQVksRUFBRUosS0FBSyxDQUFDSyxNQUYyQztBQUcvREMscUJBQWUsRUFBRU4sS0FBSyxDQUFDTztBQUh3QyxLQUFoRTtBQUtBLEdBTkQsRUFwQjZCLENBNEI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBaENELEU7Ozs7Ozs7Ozs7O0FDL0JBLGlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vaW5kZXguanNcIik7XG4iLCJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpXHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuY29uc3QgY29ycyA9IHJlcXVpcmUoJ2NvcnMnKVxyXG5jb25zdCBtb3JnYW4gPSByZXF1aXJlKCdtb3JnYW4nKVxyXG5jb25zdCBTb2NrZXRJTyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpXHJcbnZhciB2ZWNDb25lY3QgPSBbXVxyXG5cclxucmVxdWlyZSgnZG90ZW52JykuY29uZmlnKClcclxuXHJcbmNvbnN0IHNlcnZpZG9yID0gZXhwcmVzcygpXHJcblxyXG5zZXJ2aWRvci51c2UoY29ycygpKVxyXG5zZXJ2aWRvci51c2UoZXhwcmVzcy5qc29uKCkpXHJcbnNlcnZpZG9yLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpXHJcbnNlcnZpZG9yLnVzZShtb3JnYW4oJ2RldicpKVxyXG5cclxuc2Vydmlkb3Iuc2V0KCdwb3J0JywgcHJvY2Vzcy5lbnYuUE9SVCB8fCA1MDAwKVxyXG5cclxuY29uc3QgbXlTZXJ2ZXJFeHByZXNzID0gc2Vydmlkb3IubGlzdGVuKHNlcnZpZG9yLmdldCgncG9ydCcpLCBlID0+IHtcclxuXHRpZiAoZSkge1xyXG5cdFx0Y29uc29sZS5lcnJvcihlKVxyXG5cdH0gZWxzZSB7XHJcblx0XHR2ZWNDb25lY3QgPSBbXVxyXG5cdFx0Y29uc29sZS5sb2coJ0NvbmVjdGFkbyBlbiBlbCBwdWVydG8gNTAwMCcpXHJcblx0fVxyXG59KVxyXG5cclxuLy9UT0RPOiBXRUJTT0NLRVRcclxuXHJcbmNvbnN0IGlvID0gU29ja2V0SU8ubGlzdGVuKG15U2VydmVyRXhwcmVzcylcclxuXHJcbmlvLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcclxuXHQvLyBjb25zb2xlLmxvZyhzb2NrZXQuaWQpXHJcblx0c29ja2V0Lm9uKCdkaXNjb25uZWN0JywgdXNlciA9PiB7XHJcblx0XHR2YXIgaW5kZXggPSAtMVxyXG5cdFx0dmVjQ29uZWN0LmZvckVhY2goKHUsIGkpID0+IHtcclxuXHRcdFx0aWYgKHUuaWRDb25leGlvbiA9PT0gc29ja2V0LmlkKSB7XHJcblx0XHRcdFx0aW5kZXggPSB2ZWNDb25lY3QuaW5kZXhPZih1KVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0aWYgKGluZGV4ICE9PSAtMSkge1xyXG5cdFx0XHR2ZWNDb25lY3Quc3BsaWNlKGluZGV4LCAxKVxyXG5cdFx0XHRpby5zb2NrZXRzLmVtaXQoJ3VwZGF0ZUNvbmVjdCcsIHZlY0NvbmVjdClcclxuXHRcdH1cclxuXHR9KVxyXG5cdHNvY2tldC5vbignc2VuZFVzZXJDb25lY3RlZCcsIG5hbWVVc2VyID0+IHtcclxuXHRcdHZlY0NvbmVjdCA9IFsuLi52ZWNDb25lY3QsIHsgaWRDb25leGlvbjogc29ja2V0LmlkLCBub21icmVVc3VhcmlvOiBuYW1lVXNlciB9XVxyXG5cdFx0aW8uc29ja2V0cy5lbWl0KCd1cGRhdGVDb25lY3QnLCB2ZWNDb25lY3QpXHJcblx0fSlcclxuXHJcblx0c29ja2V0Lm9uKCdlbnZpYXJNc2o6cmVhY3Qtbm9kZScsIGRhdG9zID0+IHtcclxuXHRcdHNvY2tldC50byhkYXRvcy5pZFNvY2tldFJlY2VwdG9yKS5lbWl0KCdyZXNpYmlyTXNqOm5vZGUtcmVhY3QnLCB7XHJcblx0XHRcdGlkU29ja2V0RW1pc29yOiBzb2NrZXQuaWQsXHJcblx0XHRcdG5vbWJyZUVtaXNvcjogZGF0b3Mubm9tYnJlLFxyXG5cdFx0XHRtZW5zYWplUmVjaWJpZG86IGRhdG9zLm1lbnNhamUsXHJcblx0XHR9KVxyXG5cdH0pXHJcblxyXG5cdC8vIHNvY2tldC5vbignYWJyaXJDb252ZXJzYWNpb24nLCBkYXRvID0+IHtcclxuXHQvLyBcdHNvY2tldC50byhkYXRvLmlkQ29uZXhpb24pLmVtaXQoJ2FicmlyQ29udmVyc2EnLCB7fSlcclxuXHQvLyB9KVxyXG5cdC8vIGNvbnNvbGUubG9nKHZlY0NvbmVjdClcclxufSlcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb3JnYW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==