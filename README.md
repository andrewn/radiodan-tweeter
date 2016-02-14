Tweeter
===

Simple example that uses [Radiodan](http://radiodan.net) to listen to a user's timeline and speak new tweets.

Install
---

1. Clone this repo
2. `npm install`
3. `cp .env.example .env`
4. Put your Twitter credentials in `.env`

Running
---

    npm start

When a Tweet comes in, it's passed through a text-to-speech system to generate `audio/tweet.wav` and then the file is played by radiodan.

On OS X this is the built-in [`say`](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/say.1.html) command.

[`pico2wav`](http://rpihome.blogspot.de/2015/02/installing-pico-tts.html) is also supported for systems like the Raspberry Pi.

Other systems can be added in `src/speech/index.js`.
