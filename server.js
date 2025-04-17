const express = require('express');
const app = express();
const Gamepad = require('./Gamepad');
const fs = require('fs');

const server = app.listen(8080, () => {
	console.log('Server is ready!');
});
const io = require('socket.io')(server);

io.on('connection', socket => {
	socket.on('init', () => {
		console.log('Virtual Gamepad created');
		socket.gamepad = new Gamepad();
	});
	socket.on('disconnect', () => {
		socket.gamepad?.destroy?.();
	});
	socket.on('p', (buttonIndex, state) => {
		socket.gamepad?.button(buttonIndex, state);
	});
	socket.on('x', (axesIndex, state) => {
		socket.gamepad?.axis(axesIndex, state);
	});

	socket.on('ice', candidate => {
		socket.broadcast.emit('ice', candidate);
	});
	socket.on('offer', offer => {
		socket.broadcast.emit('offer', offer);
	});
	socket.on('answer', answer => {
		socket.broadcast.emit('answer', answer);
	});
});

app.get('/', (req, res) => {
	fs.createReadStream('public/index.html').pipe(res);
});

app.get('/rtc.js', (_, res) => {
	fs.createReadStream('public/rtc.js').pipe(res);
});
