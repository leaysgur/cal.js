cal
===

Generate calendar array.

## Overview
JavaScriptでカレンダーを作れと言われた経験はありませんか？
そして特定月だけじゃなくて、過去にも未来も表示したいと言われたことはありませんか？
そのうえ、今月分で余ったマスには前の月と次の月を表示したいとか言われたことはありませんか？
あっちでは日曜はじまり、こっちは月曜はじまりって言われてませんか？

そんな人のためのカレンダー表示用のライブラリです。

## Usage
```javascript
var cal = new Cal({
    year: 2014,
    month: 12,
    date: 4,
    fromMonday: 1
});

cal.getDayArr(); // => 曜日表示用のラベル配列
cal.getCalArr(); // => カレンダー本体の42マスの配列
```
