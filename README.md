# orlando
A simple bloom filter written in node.js

## Installing
```
npm i orlando
```

## Usage
```js
var SIZE_IN_BYTES = 20;

var filter = require('orlando').create(SIZE_IN_BYTES);

filter.add(new Buffer('hello'));

filter.has(new Buffer('hello')); // true

filter.has(new Buffer('goodbye')); // false
```

### Persistence
```js
filter.store('bloom.filter', function(err, res){
    console.log('done');
});
```
