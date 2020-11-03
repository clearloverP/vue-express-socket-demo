const express = require('express');
const http = require('http');
const io = require('socket.io');

const app = express();
const server = http.createServer(app);
const wss = io(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

wss.on("connection", (ws) => {
  // 存储链接数据
  wss.emit("conn_suc", "true");
  console.log("TCP 连接成功-----id为: " + ws.id);

  // 监听打开设备
  ws.on("openDev", data => {
    // 拿到socket临时分配的id
    console.log(ws.id, '----', data, 'openDev info');
    wss.emit('openDevRes', {opt: 'openDev', code: 0, success: true});
  });

  // 监听关闭设备
  ws.on("closeDev", data => {
    console.log(data, 'closeDev info');
    wss.emit('closeDevRes', {opt: 'closeDev', code: 0, success: true});
  });

  // 读取KeySn
  ws.on("getKeySn", data => {
    console.log(data, 'getKeySn info');
    wss.emit('keySn', {opt: 'keySn', code: 0, success: true});
  });

  // 验证口令
  ws.on("verifyPass", data => {
    console.log(data, 'verifyPass info');
    let {pass} = data;
    wss.emit('verifyPassRes', {opt: 'verifyPass', code: 0, success: true, pass});
  });

  // 生成随机数
  ws.on("genRandom", data => {
    console.log(data, 'genRandom info');
    wss.emit('genRandomRes', {opt: 'genRandom', code: 0, success: true, random: Math.random()});
  });

  // 写入证书
  ws.on("writeCert", data => {
    console.log(data, 'writeCert info');
    wss.emit('writeCertRes', {opt: 'writeCert', code: 0, success: true});
  });

  // 读取证书
  ws.on("readCert", data => {
    console.log(data, 'readCert info');
    wss.emit('readCertRes', {opt: 'readCert', code: 0, success: true, certSn: 'admin123_' + Math.random()});
  });

  // 签名
  ws.on("genSign", data => {
    console.log(data, 'genSign info');
    wss.emit('genSignRes', {opt: 'genSign', code: 0, success: true, sign: 'websocketSigninfo'});
  });

  // 验签
  ws.on("genVerify", data => {
    console.log(data, 'genVerify info');
    wss.emit('genVerifyRes', {opt: 'genVerify', code: 0, success: true});
  });

  ws.on('connect_failed', data => {
    console.log(data, "断开链接connect_failed");
  });

  ws.on("disconnect", () => {
    console.log("client disconnected");
  });

  ws.on("error", err => {
    console.log('error occured: ' + err);
  });
});

server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  console.log('your server is listening in port: 3000...');
}

module.exports = app;
