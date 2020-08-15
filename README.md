# Pulse Oscillator

A prototype worklet from the github issue here:  
https://github.com/WebAudio/web-audio-api-v2/issues/7

The demo page is here:  
https://projects.skratchdot.com/web-audio-api-v2-issue-7

Worklet source code is here:  
https://github.com/skratchdot/web-audio-api-v2-issue-7/blob/master/public/pulse-oscillator.js

This project was bootstrapped with:  
[Create React App](https://github.com/facebook/create-react-app).

![Demo Image](./public/worklet-demo.gif)

## Running locally

```
git clone git@github.com:skratchdot/web-audio-api-v2-issue-7.git
npm install
npm start
```

## Notes

Since create-react-app does not have a "loader" for `audioWorklet.addModule()`, I had to put
the worklet code in the public folder here: `public/pulse-oscillator.js`.

