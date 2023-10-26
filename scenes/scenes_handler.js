const { ScenesComposer } = require('grammy-scenes');

// const { depositeBalance } = require('./depositeBalance');
// const { sendSmsScene } = require('./sendSmsScene');
// const { checkCaptcha } = require('./checkCaptcha');
// const { rentEuReq } = require('./rentEuReq');

// const scenes = new ScenesComposer(sendSmsScene, depositeBalance, checkCaptcha, rentEuReq);

module.exports = new ScenesComposer();
