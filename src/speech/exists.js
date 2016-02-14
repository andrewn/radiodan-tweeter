var exec = require('child_process').exec;

// Returns a Promise that resolves with
// a boolean indicating whether the command
// was found by which
module.exports = function executableExists(commandName) {
  return new Promise(function(resolve, reject) {
    exec('/usr/bin/env which ' + commandName, function(err, stdout) {
      if (stdout.toString() !== '') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
