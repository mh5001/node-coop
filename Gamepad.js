const net = require('net');

module.exports = class Gamepad {
	constructor() {
		this.tcp = net.createConnection({
			host: '127.0.0.1',
			port: 65432
		});
		this.ready = false;
		this.tcp.on('connect', () => {
			this.ready = true;
		});
	}

	destroy() {
		this.tcp.end();
	}

	button(index, isDown) {
		this.tcp.write(`b ${index} ${Number(isDown)}\n`);
	}

	axis(index, axis) {
		this.tcp.write(`a ${index} ${axis}\n`);
	}
}
