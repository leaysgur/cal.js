;(function(global, factory) {
    'use strict';

    var __isAMD      = (typeof global.define === 'function') && global.define.amd;
    var __isCommonJS = (typeof global.exports === 'object') && global.exports;
    var __isNode     = ('process' in global);

    if (__isAMD) {
        define(['exports'], function(exports) {
            return factory(global, exports);
        });
    } else if (__isCommonJS || __isNode) {
        module.exports = factory(global, exports);
    } else {
        global.Cal = factory(global, {});
    }

}(this.self || global, function(global, Cal, undefined) {
    'use strict';

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

    Cal = function(options) {
        options = options || {};

        this.year      = (options.year|0)  || 2014;
        this.month     = (options.month|0) || 1;
        this._weekMap  = options.fromMonday ? WEEK_MAP['MON'] : WEEK_MAP['SUN'];
        this._calArr   = this._generate();

        return this;
    };

    Cal.prototype = {
        constructor: Cal,
        getCalArr:   _getCalArr,
        getDayArr:   _getDayArr,
        _generate:   _generate,
        _getDayObj:  _getDayObj
    };

    function _generate() {
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
            isNextMonth: args.isNextMonth,
            isLastMonth: args.isLastMonth
        };
    }

    function _getCalArr() {
        return this._calArr;
    }

    function _getDayArr() {
        return this._weekMap['STR'];
    }

    return Cal;

    function __pad2(num) {
        return ('0' + num).slice(-2);
    }
}));
