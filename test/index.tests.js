var assert = require('assert');
var fs = require('fs');
var buffertools = require('buffertools');
var path = require('path');

var bloomFilter = require('../');

describe('runtime', function(){
  it('should not have element if it was just created', function(){
    var filter = bloomFilter.create(10);

    assert.strictEqual(filter.has('test'), false);
  });

  it('should have element after adding it', function(){
    var filter = bloomFilter.create(10);

    filter.add('test');
    assert.ok(filter.has('test'));
  });

  it('should be able to add many elements', function(){
    var filter = bloomFilter.create(10);

    var values = [ 'test1', 'test2', 'test3' ];

    values.forEach(function(v){
      filter.add(v);
    });

    values.forEach(function(v){
      assert.ok(filter.has(v));
    });
  });
});

describe('storage', function(){
  var TEST_FILE = path.join(__dirname, 'test.dat');
  beforeEach(function(){
    if (fs.existsSync(TEST_FILE)){
      fs.unlinkSync(TEST_FILE);  
    }
  });

  it('should store filter contents in file', function(done){
    var filter = bloomFilter.create(10);
    
    var EXPECTED_BUFFER = new Buffer('102080000104080000000000020010088000000000020410208000010408000000000002041020800001040000040020800001040800000000000204', 'hex');

    filter.add('hello');

    filter.store(TEST_FILE, function(err){
      if (err) { return done(err); }

      var buffer = fs.readFileSync(TEST_FILE);
      
      assert.strictEqual(buffertools.compare(buffer, EXPECTED_BUFFER), 0);
      done();
    });
  });
});