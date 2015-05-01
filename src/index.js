/// <reference path="../typings/node/node.d.ts"/>
var crypto = require('crypto');
var fs = require('fs');
var murmur = require("murmurhash-js");

var MASKS = [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80 ];

var HASHES = [ 'MD5', 'SHA1', 'SHA256' ];

var FALSE_POSITIVE_RATE = 0.0000000001; 

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
    throw new Error('Must either provide an existing buffer or an amount of elements');
  }

  if (Buffer.isBuffer(param)){
    this._bytes = param;
  } else {
    var elements = param | 0;
    if (elements < 1){
      throw new Error('Byte size should be at least one');
    }
    
    Math.ceil()

    this.sizeInBits = Math.ceil((elements * Math.log(FALSE_POSITIVE_RATE)) / 
      Math.log(1.0 / (Math.pow(2.0, Math.log(2.0)))));
    
    this._bytes = new Buffer(this.sizeInBits >> 3).fill(0);
    
    var keys = (Math.log(2.0) * this.sizeInBits / elements) | 0;
    this._hashes = new Array(keys);
  }
};

BloomFilter.prototype.add = function(element) {
  this._applyHashes(element);
  
  for (var i = 0; (i | 0) < (this._hashes.length | 0); i = (i | 0) + (1 | 0)){
    var pos = bitAndByte(this._hashes[i | 0]);
    this._bytes[pos.byte | 0] = this._bytes[pos.byte | 0] | MASKS[pos.bit | 0];
  }
};

BloomFilter.prototype.has = function(element){
  this._applyHashes(element);
  var self = this;
  
  for (var i = 0; (i | 0) < (this._hashes.length | 0); i = (i | 0) + (1 | 0)){
    var pos = bitAndByte(this._hashes[i | 0]);
    if ((self._bytes[pos.byte] & MASKS[pos.bit]) === 0){
      return false;
    }
  }
  
  return true;
};

BloomFilter.prototype.store = function(path, cb){
  var ws = fs.createWriteStream(path);
  ws.on('finish', cb);
  ws.write(this.bytes);
  ws.end();
};

BloomFilter.prototype._applyHashes = function(element) {
  // http://www.eecs.harvard.edu/~kirsch/pubs/bbbf/esa06.pdf
  var h1 = murmur(element, 0) | 0;
  var h2 = murmur(element, h1 | 0) | 0;
  var times = this._hashes.length;
  for (var i = 0; (i | 0) < (times | 0); i = (i | 0) + (1 | 0)){
    this._hashes[i] = Math.abs((((h1 | 0) + (i | 0) * (h2 | 0)) | 0) % (this.sizeInBits | 0));
  }
};