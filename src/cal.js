 'use strict';

const WEEK_MAP = {
    SUN: {
        GAP: 0,
        STR: ['日', '月', '火', '水', '木', '金', '土']
    },
    MON: {
        GAP: 1,
        STR: ['月', '火', '水', '木', '金', '土', '日']
    }
};

const __pad2 = (num) => {
    return ('0' + num).slice(-2);
}

export default class Cal {
    constructor(options) {
      options = options || {};

      this.year     = (options.year|0)  || 2014;
      this.month    = (options.month|0) || 1;
      this.date     = (options.date|0)  || 1;
      this._weekMap = options.fromMonday ? WEEK_MAP['MON'] : WEEK_MAP['SUN'];
      this._calArr  = this._generateCalArr();
      this._dayArr  = this._generateDayArr();
    }

    getCalArr() {
        return this._calArr;
    }

    getDayArr() {
        return this._dayArr;
    }

    _generateCalArr() {
        const DAY_STR = this._weekMap['STR'];
        const GAP     = this._weekMap['GAP'];

        // monthのoriginは0から
        const thisFirstDateObj = new Date(this.year, this.month - 1, 1);
        // 次月の0day目は、今月の末日
        const thisLastDateObj  = new Date(this.year, this.month, 0);

        const thisYear     = this.year;
        const thisMonth    = this.month;
        const thisFirstDay = DAY_STR[thisFirstDateObj.getDay()];
        const thisLastDate = thisLastDateObj.getDate();

        const thisFirstDayIdx = DAY_STR.indexOf(thisFirstDay) - 1 - GAP;

        // 今月が1月なら、先月は12月で去年になる
        const mayLastYear = (thisMonth === 1) ? thisYear - 1 : thisYear;
        const lastMonth   = (thisMonth === 1) ? 12 : thisMonth - 1;

        // 先月の末日は今月の0日目
        const lastLastDateObj = new Date(mayLastYear, lastMonth, 0)
        const lastLastDate    = lastLastDateObj.getDate();

        // 今月が12月なら、来月は1月で来年になる
        const mayNextYear = (thisMonth === 12) ? thisYear + 1 : thisYear;
        const nextMonth   = (thisMonth === 12) ? 1 : thisMonth + 1;

        const calArr = [];
        let dayObj;
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

    _generateDayArr() {
        const DAY_STR = this._weekMap['STR'];
        const GAP     = this._weekMap['GAP'];

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
        const year    = args.y,
              month   = args.m,
              date    = args.d,
              i       = args.i;
        const DAY_STR = this._weekMap['STR'],
              GAP     = this._weekMap['GAP'];

        const MM          = __pad2(month);
        const DD          = __pad2(date);
        const DAY         = DAY_STR[i % 7];
        const day         = (i + GAP) % 7;
        const isSun       = day === 0;
        const isSat       = day === 6;
        const isNextMonth = args.isNextMonth;
        const isLastMonth = args.isLastMonth;
        const isBaseDate  = !isLastMonth && !isNextMonth && date === this.date;

        return {
            YYYYMMDD   : year + MM + DD,
            YYYY       : year,
            MM         : MM,
            DD         : DD,
            DAY        : DAY,
            year       : year,
            month      : Math.max(0, month - 1),
            date       : date,
            day        : day,
            isBaseDate : isBaseDate,
            isSunday   : isSun,
            isSaturday : isSat,
            isNextMonth: isNextMonth,
            isLastMonth: isLastMonth
        };
    }
}

module.exports = Cal
