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

// オプションのmonthは1始まり。返り値のmonthは0始まり。
const paramsList = [
    {
        options: { year: 2023, month: 3, firstDayOfWeek: 0 },
        expected: { firstDate: {year: 2023, month: 1, date: 26}, lastDate: {year: 2023, month: 3, date: 8 } }
    },
    {
        options: { year: 2023, month: 3, firstDayOfWeek: 1 },
        expected: { firstDate: {year: 2023, month: 1, date: 27}, lastDate: {year: 2023, month: 3, date: 9 } }
    },
    {
        options: { year: 2023, month: 3, firstDayOfWeek: 2 },
        expected: { firstDate: {year: 2023, month: 1, date: 28}, lastDate: {year: 2023, month: 3, date: 10 } }
    },
    {
        options: { year: 2023, month: 3, firstDayOfWeek: 3 },
        expected: { firstDate: {year: 2023, month: 2, date: 1}, lastDate: {year: 2023, month: 3, date: 11 } }
    },
    {
        options: { year: 2023, month: 3, firstDayOfWeek: 4 },
        expected: { firstDate: {year: 2023, month: 1, date: 23}, lastDate: {year: 2023, month: 3, date: 5 } }
    },
    {
        options: { year: 2023, month: 3, firstDayOfWeek: 5 },
        expected: { firstDate: {year: 2023, month: 1, date: 24}, lastDate: {year: 2023, month: 3, date: 6 } }
    },
    {
        options: { year: 2023, month: 3, firstDayOfWeek: 6 },
        expected: { firstDate: {year: 2023, month: 1, date: 25}, lastDate: {year: 2023, month: 3, date: 7 } }
    },
]

paramsList.forEach(({ options, expected }) => {
    test(`return collect date, month: ${options.year}/${options.month} firstDayOfWeek: ${options.firstDayOfWeek}` , t => {
        const cal = new Cal({year: options.year, month: options.month, firstDayOfWeek: options.firstDayOfWeek});
        const dayArray = cal.getCalArr();

        const firstDateObject = dayArray[0];
        const lastDateObject = dayArray[41];

        const firstDate = {
            year: firstDateObject.year,
            month: firstDateObject.month,
            date: firstDateObject.date,
        };
        const lastDate = {
            year: lastDateObject.year,
            month: lastDateObject.month,
            date: lastDateObject.date,
        };

        t.deepEqual(firstDate, expected.firstDate);
        t.deepEqual(lastDate, expected.lastDate);
    })
})

const paramsList2 = [
    {
        options: { firstDayOfWeek: 0 },
        expected: [
            { str: "日", no: 0},
            { str: "月", no: 1},
            { str: "火", no: 2},
            { str: "水", no: 3},
            { str: "木", no: 4},
            { str: "金", no: 5},
            { str: "土", no: 6}
        ]
    },
    {
        options: { firstDayOfWeek: 1 },
        expected: [
            { str: "月", no: 1},
            { str: "火", no: 2},
            { str: "水", no: 3},
            { str: "木", no: 4},
            { str: "金", no: 5},
            { str: "土", no: 6},
            { str: "日", no: 0},
        ]
    },
    {
        options: { firstDayOfWeek: 2 },
        expected: [
            { str: "火", no: 2},
            { str: "水", no: 3},
            { str: "木", no: 4},
            { str: "金", no: 5},
            { str: "土", no: 6},
            { str: "日", no: 0},
            { str: "月", no: 1}
        ]
    },
];

paramsList2.forEach(({ options, expected}) => {
    test(`return collect day,firstDayOfWeek: ${options.firstDayOfWeek}` , t => {
        const cal = new Cal({firstDayOfWeek: options.firstDayOfWeek});
        t.deepEqual(cal.getDayArr(), expected);
    })
})

