(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Cal"] = factory();
	else
		root["Cal"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 

var WEEK_MAP = {
    SUN: {
        GAP: 0,
        STR: ['日', '月', '火', '水', '木', '金', '土']
    },
    MON: {
        GAP: 1,
        STR: ['月', '火', '水', '木', '金', '土', '日']
    }
};

var Cal = function(options) {
    options = options || {};

    this.year      = (options.year|0)  || 2014;
    this.month     = (options.month|0) || 1;
    this.date      = (options.date|0)  || 1;
    this._weekMap  = options.fromMonday ? WEEK_MAP['MON'] : WEEK_MAP['SUN'];
    this._calArr   = this._generateCalArr();
    this._dayArr   = this._generateDayArr();

    return this;
};

Cal.prototype = {
    constructor:     Cal,
    getCalArr:       _getCalArr,
    getDayArr:       _getDayArr,
    _generateCalArr: _generateCalArr,
    _generateDayArr: _generateDayArr,
    _getDayObj:      _getDayObj
};

function _generateCalArr() {
    var DAY_STR = this._weekMap['STR'];
    var GAP     = this._weekMap['GAP'];

    // monthのoriginは0から
    var thisFirstDateObj = new Date(this.year, this.month - 1, 1);
    // 次月の0day目は、今月の末日
    var thisLastDateObj  = new Date(this.year, this.month, 0);

    var thisYear      = this.year;
    var thisMonth     = this.month;
    var thisFirstDay  = DAY_STR[thisFirstDateObj.getDay()];
    var thisLastDate  = thisLastDateObj.getDate();

    var thisFirstDayIdx = DAY_STR.indexOf(thisFirstDay) - 1 - GAP;

    // 今月が1月なら、先月は12月で去年になる
    var mayLastYear = (thisMonth === 1) ? thisYear - 1 : thisYear;
    var lastMonth   = (thisMonth === 1) ? 12 : thisMonth - 1;
    // 先月の末日は今月の0日目
    var lastLastDateObj = new Date(mayLastYear, lastMonth, 0)
    var lastLastDate = lastLastDateObj.getDate();

    // 今月が12月なら、来月は1月で来年になる
    var mayNextYear = (thisMonth === 12) ? thisYear + 1 : thisYear;
    var nextMonth   = (thisMonth === 12) ? 1 : thisMonth + 1;

    var calArr = [],
        dayObj;
    var i = 0 , l = 7 * 6; // 7days * 6weeks
    for (; i < l; i++) {
        var date = i - thisFirstDayIdx;
        // 先月
        if (date < 1) {
            calArr[i] = this._getDayObj({
                y: mayLastYear,
                m: lastMonth,
                d: lastLastDate + date,
                i: i,
                isNextMonth: 0,
                isLastMonth: 1
            });
        }
        // 来月
        else if (thisLastDate < date) {
            calArr[i] = this._getDayObj({
                y: mayNextYear,
                m: nextMonth,
                d: date - thisLastDate,
                i: i,
                isNextMonth: 1,
                isLastMonth: 0
            });
        }
        // 今月
        else {
            dayObj = this._getDayObj({
                y: thisYear,
                m: thisMonth,
                d: date,
                i: i,
                isNextMonth: 0,
                isLastMonth: 0
            });
            calArr[i] = dayObj;
        }
    }

    return calArr;
}

function _generateDayArr() {
    var DAY_STR = this._weekMap['STR'];
    var GAP     = this._weekMap['GAP'];

    var dayArr = [];
    var i = 0, l = DAY_STR.length;
    for (; i < l; i++) {
        dayArr[i] = {
            str: DAY_STR[i],
            no:  (i + GAP) % 7
        };
    }

    return dayArr;
}

function _getDayObj(args) {
    var year  = args.y,
        month = args.m,
        date  = args.d,
        i     = args.i;
    var DAY_STR = this._weekMap['STR'],
        GAP     = this._weekMap['GAP'];

    var MM  = __pad2(month);
    var DD  = __pad2(date);
    var DAY = DAY_STR[i % 7];
    var day = (i + GAP) % 7;
    var isSun = day === 0;
    var isSat = day === 6;
    var isNextMonth = args.isNextMonth;
    var isLastMonth = args.isLastMonth;
    var isBaseDate = !isLastMonth && !isNextMonth && date === this.date;

    return {
        YYYYMMDD:    year + MM + DD,
        YYYY:        year,
        MM:          MM,
        DD:          DD,
        DAY:         DAY,
        year:        year,
        month:       Math.max(0, month - 1),
        date:        date,
        day:         day,
        isBaseDate:  isBaseDate,
        isSunday:    isSun,
        isSaturday:  isSat,
        isNextMonth: isNextMonth,
        isLastMonth: isLastMonth
    };
}

function _getCalArr() {
    return this._calArr;
}

function _getDayArr() {
    return this._dayArr;
}

function __pad2(num) {
    return ('0' + num).slice(-2);
}

module.exports = Cal;


/***/ })
/******/ ]);
});