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
You can work with a filter and persist it to a file:
```js
// persisting a filter to disk
var filter = require('orlando').create(SIZE_IN_BYTES);

...

filter.store('bloom.data', function(err, res){
    console.log('bloom filter saved');
});
```

You can load a filter from a file:
```js
// loading a filter from disk
require('orlando').create('bloom.data', function(err, filter){
    // work with filter
});
```

