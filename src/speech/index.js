var executableExists = require('./exists');
var exec = require('child_process').exec;

var pico2wave = {
  name: 'pico2wave',
  isAvailable: function(callback) {
    return executableExists('pico2wave');
  },
  speak: function(words, outputPath) {
    return new Promise(function(resolve, reject) {
      var cmd = '/usr/bin/env pico2wave --lang="en-GB" --wave=' + outputPath + ' "' + words + '"';
      return exec(cmd, function(err, stdout, stderr) {
        err ? reject(err) : resolve(outputPath);
      });
    });
  }
};

var osxSay = {
  name: 'say',
  isAvailable: function() {
    return executableExists('say');
  },
  speak: function(words, outputPath) {
    return new Promise(function(resolve, reject) {
      var cmd = '/usr/bin/env say --voice serena --output ' + outputPath + ' --data-format=LEF32@32000 "' + words + '"';
      return exec(cmd, function(err, stdout, stderr) {
        err ? reject(err) : resolve(outputPath);
      });
    });
  }
};

var speechSystems = [
  pico2wave,
  osxSay
];

module.exports = function() {
  var promises = speechSystems.map(function(system) {
    // returns a promise that resolves to true/false
    return system.isAvailable();
  });
  return Promise
    .all(promises)
    .then(findSupported.bind(null, speechSystems));
}

function findSupported(systems, availability) {
  return availability.reduce(function(found, current, index) {
    if (found) {
      return found;
    } else if (current === true) {
      return systems[index];
    }
    return null;
  }, null)
}
