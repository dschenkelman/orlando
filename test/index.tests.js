var assert = require('assert');
var fs = require('fs');

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

describe.skip('storage', function(){
  var TEST_FILE = 'test.dat';
  beforeEach(function(){
    fs.unlinkSync(TEST_FILE);
  });

  it('should store filter contents in file', function(done){
    var filter = bloomFilter.create(10);

    filter.add(new Buffer('hello'));

    filter.store(TEST_FILE, function(err){
      if (err) { return done(err); }

      var buffer = fs.readSync(TEST_FILE);
      // check buffer against expected
    });
  });
});