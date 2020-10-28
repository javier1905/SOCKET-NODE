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
  console.log(socket.id);
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
  socket.on('abrirConversacion', dato => {
    socket.to(dato.idConexion).emit('abrirConversa', {});
  });
  console.log(vecConect);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRvdGVudlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic29ja2V0LmlvXCIiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJwYXRoIiwiY29ycyIsIm1vcmdhbiIsIlNvY2tldElPIiwidmVjQ29uZWN0IiwiY29uZmlnIiwic2Vydmlkb3IiLCJ1c2UiLCJqc29uIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwic2V0IiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJteVNlcnZlckV4cHJlc3MiLCJsaXN0ZW4iLCJnZXQiLCJlIiwiY29uc29sZSIsImVycm9yIiwibG9nIiwiaW8iLCJvbiIsInNvY2tldCIsImlkIiwidXNlciIsImluZGV4IiwiZm9yRWFjaCIsInUiLCJpIiwiaWRDb25leGlvbiIsImluZGV4T2YiLCJzcGxpY2UiLCJzb2NrZXRzIiwiZW1pdCIsIm5hbWVVc2VyIiwibm9tYnJlVXN1YXJpbyIsImRhdG8iLCJ0byJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMv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QUFBRTJCLGdCQUFVLEVBQUVQLE1BQU0sQ0FBQ0MsRUFBckI7QUFBeUJZLG1CQUFhLEVBQUVEO0FBQXhDLEtBQWYsQ0FBWjtBQUNBZCxNQUFFLENBQUNZLE9BQUgsQ0FBV0MsSUFBWCxDQUFnQixjQUFoQixFQUFnQy9CLFNBQWhDO0FBQ0EsR0FIRDtBQUlBb0IsUUFBTSxDQUFDRCxFQUFQLENBQVUsbUJBQVYsRUFBK0JlLElBQUksSUFBSTtBQUN0Q2QsVUFBTSxDQUFDZSxFQUFQLENBQVVELElBQUksQ0FBQ1AsVUFBZixFQUEyQkksSUFBM0IsQ0FBZ0MsZUFBaEMsRUFBaUQsRUFBakQ7QUFDQSxHQUZEO0FBR0FoQixTQUFPLENBQUNFLEdBQVIsQ0FBWWpCLFNBQVo7QUFDQSxDQXZCRCxFOzs7Ozs7Ozs7OztBQy9CQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxzQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2luZGV4LmpzXCIpO1xuIiwiY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXHJcbmNvbnN0IGNvcnMgPSByZXF1aXJlKCdjb3JzJylcclxuY29uc3QgbW9yZ2FuID0gcmVxdWlyZSgnbW9yZ2FuJylcclxuY29uc3QgU29ja2V0SU8gPSByZXF1aXJlKCdzb2NrZXQuaW8nKVxyXG52YXIgdmVjQ29uZWN0ID0gW11cclxuXHJcbnJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpXHJcblxyXG5jb25zdCBzZXJ2aWRvciA9IGV4cHJlc3MoKVxyXG5cclxuc2Vydmlkb3IudXNlKGNvcnMoKSlcclxuc2Vydmlkb3IudXNlKGV4cHJlc3MuanNvbigpKVxyXG5zZXJ2aWRvci51c2UoZXhwcmVzcy51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxyXG5zZXJ2aWRvci51c2UobW9yZ2FuKCdkZXYnKSlcclxuXHJcbnNlcnZpZG9yLnNldCgncG9ydCcsIHByb2Nlc3MuZW52LlBPUlQgfHwgNTAwMClcclxuXHJcbmNvbnN0IG15U2VydmVyRXhwcmVzcyA9IHNlcnZpZG9yLmxpc3RlbihzZXJ2aWRvci5nZXQoJ3BvcnQnKSwgZSA9PiB7XHJcblx0aWYgKGUpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoZSlcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmVjQ29uZWN0ID0gW11cclxuXHRcdGNvbnNvbGUubG9nKCdDb25lY3RhZG8gZW4gZWwgcHVlcnRvIDUwMDAnKVxyXG5cdH1cclxufSlcclxuXHJcbi8vVE9ETzogV0VCU09DS0VUXHJcblxyXG5jb25zdCBpbyA9IFNvY2tldElPLmxpc3RlbihteVNlcnZlckV4cHJlc3MpXHJcblxyXG5pby5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XHJcblx0Y29uc29sZS5sb2coc29ja2V0LmlkKVxyXG5cdHNvY2tldC5vbignZGlzY29ubmVjdCcsIHVzZXIgPT4ge1xyXG5cdFx0dmFyIGluZGV4ID0gLTFcclxuXHRcdHZlY0NvbmVjdC5mb3JFYWNoKCh1LCBpKSA9PiB7XHJcblx0XHRcdGlmICh1LmlkQ29uZXhpb24gPT09IHNvY2tldC5pZCkge1xyXG5cdFx0XHRcdGluZGV4ID0gdmVjQ29uZWN0LmluZGV4T2YodSlcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdGlmIChpbmRleCAhPT0gLTEpIHtcclxuXHRcdFx0dmVjQ29uZWN0LnNwbGljZShpbmRleCwgMSlcclxuXHRcdFx0aW8uc29ja2V0cy5lbWl0KCd1cGRhdGVDb25lY3QnLCB2ZWNDb25lY3QpXHJcblx0XHR9XHJcblx0fSlcclxuXHRzb2NrZXQub24oJ3NlbmRVc2VyQ29uZWN0ZWQnLCBuYW1lVXNlciA9PiB7XHJcblx0XHR2ZWNDb25lY3QgPSBbLi4udmVjQ29uZWN0LCB7IGlkQ29uZXhpb246IHNvY2tldC5pZCwgbm9tYnJlVXN1YXJpbzogbmFtZVVzZXIgfV1cclxuXHRcdGlvLnNvY2tldHMuZW1pdCgndXBkYXRlQ29uZWN0JywgdmVjQ29uZWN0KVxyXG5cdH0pXHJcblx0c29ja2V0Lm9uKCdhYnJpckNvbnZlcnNhY2lvbicsIGRhdG8gPT4ge1xyXG5cdFx0c29ja2V0LnRvKGRhdG8uaWRDb25leGlvbikuZW1pdCgnYWJyaXJDb252ZXJzYScsIHt9KVxyXG5cdH0pXHJcblx0Y29uc29sZS5sb2codmVjQ29uZWN0KVxyXG59KVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRvdGVudlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vcmdhblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9