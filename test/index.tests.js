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
  
  // last byte in buffer is number of hash functions
  var BUFFER_WITH_HELLO = new Buffer('10208000010408000000000002001008800000000002041020800001040800000000000204102080000104000004002080000104080000000000020421', 'hex');
  
  describe('saving to file', function(){
    before(function(){
      if (fs.existsSync(TEST_FILE)){
        fs.unlinkSync(TEST_FILE);  
      }
    });
    
    it('should store filter contents in file', function(done){
      var filter = bloomFilter.create(10);
      
  
      filter.add('hello');
  
      filter.store(TEST_FILE, function(err){
        if (err) { return done(err); }
  
        var buffer = fs.readFileSync(TEST_FILE);
        
        assert.strictEqual(buffertools.compare(buffer, BUFFER_WITH_HELLO), 0);
        done();
      });
    });
  });
  
  describe('reading from file', function(){
    before(function(){
      fs.writeFileSync(TEST_FILE, BUFFER_WITH_HELLO);
    });
    
    it('should load filter contents from file', function(done){
      bloomFilter.load(TEST_FILE, function(err, filter){
        if (err) { return done(err); }
        assert.ok(filter.has('hello'));
        done();
      });
    });
  });
});