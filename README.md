# orlando
A simple bloom filter written in node.js

## Installing
```
npm i orlando
```

## Usage
The bloom filter stores keys that are string values. If you want to store something else (e.g. a `Buffer`) just turn it into a `String`. 
```js
var APPROXIMATE_NUMBER_OF_ELEMENTS = 20;

var filter = require('orlando').create(APPROXIMATE_NUMBER_OF_ELEMENTS);

filter.add('hello');

filter.has('hello'); // true

filter.has('goodbye'); // false
```

### Persistence
You can work with a filter and persist it to a file:
```js
// persisting a filter to disk
var filter = require('orlando').create(APPROXIMATE_NUMBER_OF_ELEMENTS);

...

filter.store('bloom.data', function(err, res){
    console.log('bloom filter saved');
});
```

You can later load a filter from a file:
```js
// loading a filter from disk
require('orlando').load('bloom.data', function(err, filter){
    // work with filter
});
```

