var crypto = require('crypto');
var fs = require('fs');

var MASKS = [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80 ];

exports.create = function(sizeInBytes){
  return new BloomFilter(sizeInBytes);
};

var BloomFilter = function(sizeInBytes){
  if (!sizeInBytes || sizeInBytes < 1){
    throw new Error('Byte size should be at least one');
  }

  sizeInBytes = sizeInBytes | 0;

  this.size = sizeInBytes * 8;
  this.bytes = new Buffer(sizeInBytes).fill(0);
};

BloomFilter.prototype.add = function(element) {
  var bits = this.__applyHashes(element);

  bits.forEach(function(position){
    var byte = (position / 8) | 0;
    var bit = position % 8;
    this.bytes[byte] = this.bytes[byte] | MASKS[bit];
  }, this);
};

BloomFilter.prototype.has = function(element){
  var bits = this.__applyHashes(element);
  var self = this;

  return !!bits.reduce(function(inFilter, position){
    var byte = (position / 8) | 0;
    var bit = position % 8;

    return inFilter && (self.bytes[byte] & MASKS[bit]);
  }, true);
};

BloomFilter.prototype.store = function(path, cb){
  var ws = fs.createWriteStream(path);
  ws.on('finish', cb);
  ws.write(this.bytes);
  ws.end();
};

BloomFilter.prototype.__applyHashes = function(element) {
  var digest1 = crypto.createHash('md5').update(element).digest();
  var digest2 = crypto.createHash('SHA1').update(element).digest();
  var digest3 = crypto.createHash('SHA256').update(element).digest();

  var bits = [
    digest1[digest1.length - 1] % this.size,
    digest2[digest2.length - 1] % this.size,
    digest3[digest3.length - 1] % this.size
  ];

  return bits;
};