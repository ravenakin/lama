const express = require('express');
const { spawn } = require('child_process');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.post('/run-model', (req, res) => {
  const python = spawn('python', ['./app.py', req.body.input]);
  let dataToSend;

  python.stdout.on('data', (data) => {
    dataToSend = data.toString();
  });

  python.on('close', (code) => {
    res.send(dataToSend);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('Server started on port 3000');
});
