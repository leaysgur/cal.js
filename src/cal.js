 'use strict';

const utils = {
    getToday() {
        const d = new Date();
        return {
            year:  d.getFullYear(),
            month: d.getMonth() + 1,
            date:  d.getDate(),
        };
    },

    getWeekMap(map, firstDayOfWeek) {
        const defaultMap = ['日', '月', '火', '水', '木', '金', '土'];
        // オプションで渡ってきたものは、妥当なら使う
        const hasUserMap = map && map.length === 7 && Array.isArray(map);

        const DAY_STR = hasUserMap ? map
                                   : defaultMap.slice(firstDayOfWeek).concat(defaultMap.slice(0, firstDayOfWeek))

        return { DAY_STR, GAP: firstDayOfWeek };
    },

    getFirstDayOfWeek(firstDayOfWeek, fromMonday) {
        if ([0,1,2,3,4,5,6].includes(firstDayOfWeek)) {
            return firstDayOfWeek;
        }

        return !!fromMonday ? 1 : 0;
    },

    pad2(num) {
        return ('0' + num).slice(-2);
    },
};

export default class Cal {
    constructor(options) {
      options = options || {};

      const today = utils.getToday();
      this.year  = (options.year|0)  || today.year;
      this.month = (options.month|0) || today.month;
      this.date  = (options.date|0)  || today.date;

      this.firstDayOfWeek = utils.getFirstDayOfWeek(options.firstDayOfWeek, options.fromMonday);
      this._weekMap = utils.getWeekMap(options.dayStrArr, this.firstDayOfWeek);
      this._calArr  = this._generateCalArr();
      this._dayArr  = this._generateDayArr();
    }

    getCalArr() {
        return this._calArr.slice();
    }

    getDayArr() {
        return this._dayArr.slice();
    }

    _generateCalArr() {
        // monthのoriginは0から
        const thisFirstDateObj = new Date(this.year, this.month - 1, 1);
        // 次月の0day目は、今月の末日
        const thisLastDateObj  = new Date(this.year, this.month, 0);

        const thisYear     = this.year;
        const thisMonth    = this.month;
        const thisLastDate = thisLastDateObj.getDate();

        // この値により、カレンダーの開始日が決まる。
        // -1: 開始日は1日 0: 1日の1日前から（前月最終日）... 5: 1日の6日前からとなる。
        const thisFirstDayIdx = (() => {
            const dayGap = thisFirstDateObj.getDay() - this.firstDayOfWeek;
            return dayGap < 0 ? 6 + dayGap : dayGap - 1;
        })();

        // 今月が1月なら、先月は12月で去年になる
        const mayLastYear = (thisMonth === 1) ? thisYear - 1 : thisYear;
        const lastMonth   = (thisMonth === 1) ? 12 : thisMonth - 1;

        // 先月の末日は今月の0日目
        const lastLastDateObj = new Date(mayLastYear, lastMonth, 0);
        const lastLastDate    = lastLastDateObj.getDate();

        // 今月が12月なら、来月は1月で来年になる
        const mayNextYear = (thisMonth === 12) ? thisYear + 1 : thisYear;
        const nextMonth   = (thisMonth === 12) ? 1 : thisMonth + 1;

        const calArr = [];
        let i = 0, l = 7 * 6; // 7days * 6weeks
        for (; i < l; i++) {
            const date = i - thisFirstDayIdx;
            // 先月
            if (date < 1) {
                calArr[i] = this._getDayObj({
                    y: mayLastYear,
                    m: lastMonth,
                    d: lastLastDate + date,
                    i: i,
                    isNextMonth: false,
                    isLastMonth: true
                });
            }
            // 来月
            else if (thisLastDate < date) {
                calArr[i] = this._getDayObj({
                    y: mayNextYear,
                    m: nextMonth,
                    d: date - thisLastDate,
                    i: i,
                    isNextMonth: true,
                    isLastMonth: false
                });
            }
            // 今月
            else {
                calArr[i] = this._getDayObj({
                    y: thisYear,
                    m: thisMonth,
                    d: date,
                    i: i,
                    isNextMonth: false,
                    isLastMonth: false
                });
            }
        }

        return calArr;
    }

    _generateDayArr() {
        const { DAY_STR, GAP } = this._weekMap;

        const dayArr = [];
        let i = 0, l = DAY_STR.length;
        for (; i < l; i++) {
            dayArr[i] = {
                str: DAY_STR[i],
                no : (i + GAP) % 7
            };
        }

        return dayArr;
    }

    _getDayObj(args) {
        const { DAY_STR, GAP } = this._weekMap;
        const year    = args.y,
              month   = args.m,
              date    = args.d,
              i       = args.i;

        const YYYY        = String(year);
        const MM          = utils.pad2(month);
        const DD          = utils.pad2(date);
        const DAY         = DAY_STR[i % 7];
        const day         = (i + GAP) % 7;
        const isSunday    = day === 0;
        const isSaturday  = day === 6;
        const isNextMonth = args.isNextMonth;
        const isLastMonth = args.isLastMonth;
        const isBaseDate  = !isLastMonth && !isNextMonth && date === this.date;

        return {
            YYYYMMDD: YYYY + MM + DD,
            YYYY,
            MM,
            DD,
            DAY,
            year,
            month: Math.max(0, month - 1),
            date,
            day,
            isBaseDate,
            isSunday,
            isSaturday,
            isNextMonth,
            isLastMonth,
        };
    }
}

module.exports = Cal;
