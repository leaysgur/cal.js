cal.js
===

Generate calendar array.

## Overview
JavaScriptでカレンダーを作れと言われた経験はありませんか？

- そして特定月だけじゃなくて、過去にも未来も表示したいと言われたことはありませんか？
- そのうえ、今月分で余ったマスには前の月と次の月を表示したいとか言われたことはありませんか？
- あっちでは日曜はじまり、こっちは月曜はじまりって言われてませんか？
- 今日はそれ用のマークつけたいとか言われますか？

そんな人のためのカレンダー表示用のライブラリです。

## Install

```sh
npm i cal.js --save

# or
yarn add cal.js
```

or

```html
<script src="./dist/cal.min.js"></script>
```

## Usage
```javascript
const Cal = require('cal.js');

// 引数はすべてOptional
const cal = new Cal({
    // 未指定の場合は今日
    year:  2017,
    month: 1,
    date:  13,

    // 週の始まりの曜日 0:日曜 1:月曜 ... 6:土曜
    firstDayOfWeek: 2,

    // 月曜はじまり or NOT（falseは日曜始まり）firstDayOfWeekが指定されている場合は無視される。
    fromMonday: true,

    // 未指定の場合は、「月火水木金土日」フォーマット
    dayStrArr: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
});

cal.getDayArr(); // => 曜日表示用のラベル配列
cal.getCalArr(); // => カレンダー本体の42マスの配列
```
