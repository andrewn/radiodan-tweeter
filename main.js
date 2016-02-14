// Patch Promises in globally for
// node versions that don't have them
require("native-promise-only");

var Twit = require('twit');
var join = require('path').join;
var client = require('radiodan-client');

var stream; // The Twitter stream

// @todo  We should wait for this to actually complete before
//       continuing because it's async. However, it's usually
//       ok because the rest of the app takes a while to get
//       started.
var speech;
require('./src/speech')()
  .then(function(availableSpeech) {
    speech = availableSpeech;
    console.log('speech is loaded', speech);
  })
  .catch(function(err) {
    console.error('Error loading speech', err);
    process.exit(1);
  });


var URL_MATCHER = /(https?:\/\/)\S*/g;
var filePath = join(__dirname, 'audio', 'tweet.wav');

var radiodan = client.create();

// Get the player object called `main`
// as specified in ./config/radiodan-config.json
var player = radiodan.player.get('main');

player.on('database.update.end', init);

player
  .updateDatabase();

function speak(words) {
  console.log('speak()', words);
  speech
    .speak(words, filePath)
    .then(function() {
      player
        .add({
          clear: true,
          playlist: ['tweet.wav']
        })
        .then(player.play);
    });
}

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function init() {
  if (stream) {
    return;
  }

  console.log('init, joining twitter stream');
  stream = T.stream('user', {});
  stream.on('tweet', function(tweet) {
    console.log('Tweet: ', tweet.text);
    if (tweet.text) {
      var sanitise = tweet.text.replace(URL_MATCHER, '');
      console.log('Speak:', sanitise);
      speak(sanitise);
    }
  });

  stream.on('error', function(error) {
    throw error;
  });
}
