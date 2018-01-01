'use strict';

var _ = require('lodash');
var fs = require('fs');
var osenv = require('osenv');
var temp = require('temp').track();
var promise = require('bluebird');

promise.promisifyAll(fs);
promise.promisifyAll(temp);

module.exports = function(screen, text) {
  promise.promisifyAll(screen);

  if (_.isPlainObject(text)) {
    text = JSON.stringify(text, null, 2);
  }

  return temp.openAsync({ suffix: '.json' })
    .then(function(info) {
      return fs.writeFileAsync(info.path, text, { mode: 384 }).then(function() { return info; });
    })
    .then(function(info) {
      return screen.execAsync(osenv.editor(), [info.path], {}).then(function() { return info; });
    })
    .then(function(info) {
      return fs.readFileAsync(info.path, 'utf8');
    })
    .catch(function(err) {
      console.error(err);
      throw err;
    });
};
