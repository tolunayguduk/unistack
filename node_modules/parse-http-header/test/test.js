var parser = require('..');
var assert = require('assert');
var debug  = require('debug')('test');

describe('parse-http-header', function() {

  it('should parse header with parameters', function () {
    var param = parser('application/json; charset=utf8');
    debug(param);
    assert.deepEqual(Object.keys(param), [ '0', '1', 'charset']);
    assert.equal(param.toArray().length, 2);
    assert.equal(param[0], 'application/json');
    assert.deepEqual(param[1], { charset: 'utf8' });
    assert.equal(param['charset'], 'utf8');
  });

  it('should parse header with dangling separator and missing parameters', function() {
    var param = parser('application/json;');
    debug(param);
    assert.deepEqual(Object.keys(param), [ '0' ]);
    assert.equal(param.toArray().length, 1);
    assert.equal(param[0], 'application/json');
  });

  it('should parse header without parameters', function() {
    var param = parser('application/json');
    debug(param);
    assert.deepEqual(Object.keys(param), [ '0' ]);
    assert.equal(param.toArray().length, 1);
    assert.equal(param[0], 'application/json');
  });


  it('should return empty string when passed an empty string', function() {
    var param = parser('');
    debug(param);
    assert.deepEqual(Object.keys(param), [ '0' ]);
    assert.equal(param.toArray().length, 1);
    assert.equal(param[0], '');
  });

});