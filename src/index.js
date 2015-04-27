var crypto = require('crypto');
var fs = require('fs');

var MASKS = [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80 ];

var HASHES = [ 'MD5', 'SHA1', 'SHA256' ];

exports.create = function(sizeInBytes){
  return new BloomFilter(sizeInBytes);
};

exports.load = function(path, cb){
  fs.readFile(path, function(err, content){
    if (err) { return cb(err); }

    cb(null, new BloomFilter(content));
  });
};

var bitAndByte = function(pos){
  return { byte: (pos / 8) | 0, bit: pos % 8 };
};

var BloomFilter = function(param){
  // TODO: calculation based on probability and size
  if (!param){
    throw new Error('Must either provide an existing buffer or a byte size');
  }

  if (Buffer.isBuffer(param)){
    this._bytes = param;
    this.size = param.length * 8;
  } else {
    var sizeInBytes = param | 0;
    if (sizeInBytes < 1){
      throw new Error('Byte size should be at least one');
    }

    this.size = sizeInBytes * 8;
    this._bytes = new Buffer(sizeInBytes).fill(0);
  }
};

BloomFilter.prototype.add = function(element) {
  var bits = this._applyHashes(element);

  bits.forEach(function(position){
    var pos = bitAndByte(position);
    this._bytes[pos.byte] = this._bytes[pos.byte] | MASKS[pos.bit];
  }, this);
};

BloomFilter.prototype.has = function(element){
  var bits = this._applyHashes(element);
  var self = this;

  return !bits.some(function(position){
    var pos = bitAndByte(position);
    return !(self._bytes[pos.byte] & MASKS[pos.bit]);
  });
};

BloomFilter.prototype.store = function(path, cb){
  var ws = fs.createWriteStream(path);
  ws.on('finish', cb);
  ws.write(this.bytes);
  ws.end();
};

BloomFilter.prototype._applyHashes = function(element) {
  // TODO: something like http://www.eecs.harvard.edu/~kirsch/pubs/bbbf/esa06.pdf
  return HASHES.map(function(hashType){
    var digest = crypto.createHash(hashType).update(element).digest();

    return digest[digest.length - 1] % this.size;
  }, this);
};