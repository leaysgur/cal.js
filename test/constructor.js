const test = require('ava');
const Cal = require('../');

test('export constructor', t => {
    t.notThrows(() => { new Cal(); });
});

test('returns another instance', t => {
    const c1 = new Cal();
    const c2 = new Cal();
    t.false(c1 === c2);
});

test('can set base year', t => {
    const c = new Cal({ year: 2012 });
    const arr = c.getCalArr();
    // 1行目の末尾は指定したものになる
    t.is(arr[6].year, 2012);
});

test('can set base month', t => {
    const c = new Cal({ month: 12 });
    const arr = c.getCalArr();
    // 1行目の末尾は指定したものになる
    t.is(arr[6].month, 12 - 1);
});

test('isBaseDate', t => {
    const c = new Cal({ date: 12 });
    const arr = c.getCalArr();

    const d = arr.filter(d => d.date === 12)[0];
    t.true(d.isBaseDate);
});

test('isSaturday', t => {
    const c = new Cal({ year: 2017, month: 1, date:14 });
    const arr = c.getCalArr();

    const d = arr.filter(d => d.month === 0 && d.date === 14)[0];
    t.true(d.isSaturday);
});

test('isSunday', t => {
    const c = new Cal({ year: 2017, month: 1, date:15 });
    const arr = c.getCalArr();

    const d = arr.filter(d => d.month === 0 && d.date === 15)[0];
    t.true(d.isSunday);
});

test('can set cal from Monday', t => {
    const c = new Cal({ fromMonday: true });
    const arr = c.getDayArr();

    t.is(arr[0].str, '月');
});

test('can set original day str', t => {
    const c = new Cal({ dayStrArr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] });
    const arr = c.getDayArr();

    t.is(arr[0].str, 'Sun');
});

test('do not accept invalid day str', t => {
    const missing1 = [];
    const missing2 = null;
    const missing3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const notArray = '1234567';

    const c1 = new Cal({ dayStrArr: missing1 }).getDayArr()[0].str === '日';
    const c2 = new Cal({ dayStrArr: missing2 }).getDayArr()[0].str === '日';
    const c3 = new Cal({ dayStrArr: missing3 }).getDayArr()[0].str === '日';
    const c4 = new Cal({ dayStrArr: notArray }).getDayArr()[0].str === '日';

    t.true(c1 && c2 && c3 && c4);
});

const paramsList = [
    {
        year: 2023,
        month: 3,
        firstDayOfWeek: 0,
        expected: {
            firstWeek: [26,27,28,1,2,3,4],
            lastWeek: [2,3,4,5,6,7,8]
        }
    },
    {
        year: 2023,
        month: 3,
        firstDayOfWeek: 1,
        expected: {
            firstWeek: [27,28,1,2,3,4,5],
            lastWeek: [3,4,5,6,7,8,9]
        }
    },
    {
        year: 2023,
        month: 3,
        firstDayOfWeek: 2,
        expected: {
            firstWeek: [28,1,2,3,4,5,6],
            lastWeek: [4,5,6,7,8,9,10]
        }
    },
    {
        year: 2023,
        month: 3,
        firstDayOfWeek: 3,
        expected: {
            firstWeek: [22,23,24,25,26,27,28],
            lastWeek: [29,30,31,1,2,3,4]
        }
    },
    {
        year: 2023,
        month: 3,
        firstDayOfWeek: 4,
        expected: {
            firstWeek: [23,24,25,26,27,28,1],
            lastWeek: [30,31,1,2,3,4,5]
        }
    },
]

paramsList.forEach(params => {
    test(`return collect date ${params.year}/${params.month} firstDayOfWeek: ${params.firstDayOfWeek}` , t => {
        const cal = new Cal({year: params.year, month: params.month, firstDayOfWeek: params.firstDayOfWeek})
        const dayArray = cal.getCalArr();

        const firstWeek = dayArray.slice(0, 7).map(v => v.date)
        const lastWeek = dayArray.slice(35).map(v => v.date)

        t.deepEqual(firstWeek, params.expected.firstWeek)
        t.deepEqual(lastWeek, params.expected.lastWeek)
    })
})
