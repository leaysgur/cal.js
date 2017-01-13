const test = require('ava');
const Cal = require('../');

test('.getCalArr() returns array', t => {
    const c = new Cal();
    const arr = c.getCalArr();

    t.true(Array.isArray(arr));
});

test('.getDayArr() returns array', t => {
    const c = new Cal();
    const arr = c.getDayArr();

    t.true(Array.isArray(arr));
});

test('.getCalArr() returns copied array', t => {
    const c = new Cal();
    const arr = c.getCalArr();

    arr[0] = null;
    t.not(c.getCalArr()[0], null);
});

test('.getDayArr() returns copied array', t => {
    const c = new Cal();
    const arr = c.getDayArr();

    arr[0] = null;
    t.not(c.getDayArr()[0], null);
});
