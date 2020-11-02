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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRvdGVudlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic29ja2V0LmlvXCIiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJwYXRoIiwiY29ycyIsIm1vcmdhbiIsIlNvY2tldElPIiwidmVjQ29uZWN0IiwiY29uZmlnIiwic2Vydmlkb3IiLCJ1c2UiLCJqc29uIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwic2V0IiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJteVNlcnZlckV4cHJlc3MiLCJsaXN0ZW4iLCJnZXQiLCJlIiwiY29uc29sZSIsImVycm9yIiwibG9nIiwiaW8iLCJvbiIsInNvY2tldCIsInVzZXIiLCJpbmRleCIsImZvckVhY2giLCJ1IiwiaSIsImlkQ29uZXhpb24iLCJpZCIsImluZGV4T2YiLCJzcGxpY2UiLCJzb2NrZXRzIiwiZW1pdCIsIm5hbWVVc2VyIiwibm9tYnJlVXN1YXJpbyIsImRhdG9zIiwidG8iLCJpZFNvY2tldFJlY2VwdG9yIiwiaWRTb2NrZXRFbWlzb3IiLCJub21icmVFbWlzb3IiLCJub21icmUiLCJtZW5zYWplUmVjaWJpZG8iLCJtZW5zYWplIiwiZXMiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFD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UUFBUSxJQUFJO0FBQ3pDaEMsYUFBUyxHQUFHLENBQUMsR0FBR0EsU0FBSixFQUFlO0FBQUUwQixnQkFBVSxFQUFFTixNQUFNLENBQUNPLEVBQXJCO0FBQXlCTSxtQkFBYSxFQUFFRDtBQUF4QyxLQUFmLENBQVo7QUFDQWQsTUFBRSxDQUFDWSxPQUFILENBQVdDLElBQVgsQ0FBZ0IsY0FBaEIsRUFBZ0MvQixTQUFoQztBQUNBLEdBSEQ7QUFLQW9CLFFBQU0sQ0FBQ0QsRUFBUCxDQUFVLHNCQUFWLEVBQWtDZSxLQUFLLElBQUk7QUFDMUNkLFVBQU0sQ0FBQ2UsRUFBUCxDQUFVRCxLQUFLLENBQUNFLGdCQUFoQixFQUFrQ0wsSUFBbEMsQ0FBdUMsdUJBQXZDLEVBQWdFO0FBQy9ETSxvQkFBYyxFQUFFakIsTUFBTSxDQUFDTyxFQUR3QztBQUUvRFcsa0JBQVksRUFBRUosS0FBSyxDQUFDSyxNQUYyQztBQUcvREMscUJBQWUsRUFBRU4sS0FBSyxDQUFDTztBQUh3QyxLQUFoRTtBQUtBLEdBTkQ7QUFRQXJCLFFBQU0sQ0FBQ0QsRUFBUCxDQUFVLHdCQUFWLEVBQW9DZSxLQUFLLElBQUk7QUFDNUNkLFVBQU0sQ0FDSmUsRUFERixDQUNLRCxLQUFLLENBQUNHLGNBRFgsRUFFRU4sSUFGRixDQUVPLHdCQUZQLEVBRWlDO0FBQy9CTSxvQkFBYyxFQUFFakIsTUFBTSxDQUFDTyxFQURRO0FBRS9CVyxrQkFBWSxFQUFFSixLQUFLLENBQUNGLFFBRlc7QUFHL0JVLFFBQUUsRUFBRVIsS0FBSyxDQUFDUTtBQUhxQixLQUZqQztBQU9BLEdBUkQ7QUFTQSxDQXBDRCxFOzs7Ozs7Ozs7OztBQy9CQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2luZGV4LmpzXCIpO1xuIiwiY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXHJcbmNvbnN0IGNvcnMgPSByZXF1aXJlKCdjb3JzJylcclxuY29uc3QgbW9yZ2FuID0gcmVxdWlyZSgnbW9yZ2FuJylcclxuY29uc3QgU29ja2V0SU8gPSByZXF1aXJlKCdzb2NrZXQuaW8nKVxyXG52YXIgdmVjQ29uZWN0ID0gW11cclxuXHJcbnJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpXHJcblxyXG5jb25zdCBzZXJ2aWRvciA9IGV4cHJlc3MoKVxyXG5cclxuc2Vydmlkb3IudXNlKGNvcnMoKSlcclxuc2Vydmlkb3IudXNlKGV4cHJlc3MuanNvbigpKVxyXG5zZXJ2aWRvci51c2UoZXhwcmVzcy51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxyXG5zZXJ2aWRvci51c2UobW9yZ2FuKCdkZXYnKSlcclxuXHJcbnNlcnZpZG9yLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgNTAwMClcclxuXHJcbmNvbnN0IG15U2VydmVyRXhwcmVzcyA9IHNlcnZpZG9yLmxpc3RlbihzZXJ2aWRvci5nZXQoJ3BvcnQnKSwgZSA9PiB7XHJcblx0aWYgKGUpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoZSlcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmVjQ29uZWN0ID0gW11cclxuXHRcdGNvbnNvbGUubG9nKCdDb25lY3RhZG8gZW4gZWwgcHVlcnRvIDUwMDAnKVxyXG5cdH1cclxufSlcclxuXHJcbi8vVE9ETzogV0VCU09DS0VUXHJcblxyXG5jb25zdCBpbyA9IFNvY2tldElPLmxpc3RlbihteVNlcnZlckV4cHJlc3MpXHJcblxyXG5pby5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XHJcblx0c29ja2V0Lm9uKCdkaXNjb25uZWN0JywgdXNlciA9PiB7XHJcblx0XHR2YXIgaW5kZXggPSAtMVxyXG5cdFx0dmVjQ29uZWN0LmZvckVhY2goKHUsIGkpID0+IHtcclxuXHRcdFx0aWYgKHUuaWRDb25leGlvbiA9PT0gc29ja2V0LmlkKSB7XHJcblx0XHRcdFx0aW5kZXggPSB2ZWNDb25lY3QuaW5kZXhPZih1KVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0aWYgKGluZGV4ICE9PSAtMSkge1xyXG5cdFx0XHR2ZWNDb25lY3Quc3BsaWNlKGluZGV4LCAxKVxyXG5cdFx0XHRpby5zb2NrZXRzLmVtaXQoJ3VwZGF0ZUNvbmVjdCcsIHZlY0NvbmVjdClcclxuXHRcdH1cclxuXHR9KVxyXG5cdHNvY2tldC5vbignc2VuZFVzZXJDb25lY3RlZCcsIG5hbWVVc2VyID0+IHtcclxuXHRcdHZlY0NvbmVjdCA9IFsuLi52ZWNDb25lY3QsIHsgaWRDb25leGlvbjogc29ja2V0LmlkLCBub21icmVVc3VhcmlvOiBuYW1lVXNlciB9XVxyXG5cdFx0aW8uc29ja2V0cy5lbWl0KCd1cGRhdGVDb25lY3QnLCB2ZWNDb25lY3QpXHJcblx0fSlcclxuXHJcblx0c29ja2V0Lm9uKCdlbnZpYXJNc2o6cmVhY3Qtbm9kZScsIGRhdG9zID0+IHtcclxuXHRcdHNvY2tldC50byhkYXRvcy5pZFNvY2tldFJlY2VwdG9yKS5lbWl0KCdyZXNpYmlyTXNqOm5vZGUtcmVhY3QnLCB7XHJcblx0XHRcdGlkU29ja2V0RW1pc29yOiBzb2NrZXQuaWQsXHJcblx0XHRcdG5vbWJyZUVtaXNvcjogZGF0b3Mubm9tYnJlLFxyXG5cdFx0XHRtZW5zYWplUmVjaWJpZG86IGRhdG9zLm1lbnNhamUsXHJcblx0XHR9KVxyXG5cdH0pXHJcblxyXG5cdHNvY2tldC5vbignZXNjcmliaWVuZG86cmVhY3Qtbm9kZScsIGRhdG9zID0+IHtcclxuXHRcdHNvY2tldFxyXG5cdFx0XHQudG8oZGF0b3MuaWRTb2NrZXRFbWlzb3IpXHJcblx0XHRcdC5lbWl0KCdlc2NyaWJpZW5kbzpub2RlLXJlYWN0Jywge1xyXG5cdFx0XHRcdGlkU29ja2V0RW1pc29yOiBzb2NrZXQuaWQsXHJcblx0XHRcdFx0bm9tYnJlRW1pc29yOiBkYXRvcy5uYW1lVXNlcixcclxuXHRcdFx0XHRlczogZGF0b3MuZXMsXHJcblx0XHRcdH0pXHJcblx0fSlcclxufSlcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb3JnYW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==