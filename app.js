

const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const app = new Koa();
const moment = require('moment');

let d = moment(new Date()).format('YYYY-MM-DD');
console.log(d);

app.use(KoaStaticCache('./public', {
  prefix: '/public',
  gzip: true,
  dynamic: true
}))
const server = require('http').createServer(app.callback());

const users = [];

const options = { /*...*/ };
const io = require('socket.io')(server, options);

io.on('connection', socket => {

  users.push({
    id: socket.id
  });

  console.log("有人通过socket.io连接了");

  //* 通知当前socket
  socket.emit('hello', `欢迎你${socket.id} [${d}]`);

  //* 通过socket通知给其他socket
  socket.broadcast.emit('hello', `有新的伙伴${socket.id}加入`);

  socket.broadcast.emit('userUpdate', users);

  socket.on('message', data => {
    socket.broadcast.emit('message', `${socket.id}说 ：${data}`);
  })
});



server.listen(3000);