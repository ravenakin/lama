const express = require('express');
const { spawn } = require('child_process');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.use(express.json());

app.post('/run-model', (req, res) => {
  const python = spawn('python', ['./app.py', req.body.input]);
  let dataToSend = '';

  python.stdout.on('data', (data) => {
    dataToSend += data.toString();
  });

  python.on('close', (code) => {
    res.send(dataToSend);
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    // Call the Python script to get the model's response
    fetch('/run-model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: msg })
    })
      .then((res) => res.text())
      .then((response) => {
        io.emit('chat message', response);
      });
  });
});

http.listen(3000, () => {
  console.log('Server started on port 3000');
});
