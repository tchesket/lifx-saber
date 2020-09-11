	// required for WebSocket events
const WebSocket = require('ws');
	// defines http-status json events
const events = {
	hello(data) {
	},
	noteCut(data, fullStatus) {
	},
	songStart(data) {
	},
};
let lifxIP;


	// sends a "LIFX LAN Protocol" (56700) packet to flash light(s) blue once, for 100ms (HalfSine WaveForm)
function blue() {
	const dgram = require('dgram');
		// packet was captured via wireshark using unrelated program to generate, packet construction info can be found at https://lan.developer.lifx.com/docs/building-a-lifx-packet, incorporating code to do this automatically would be ideal but is beyond my abilities currently, feel free to do so yourself
	const blue_flash = Buffer.from([0x39, 0x00, 0x00, 0x14, 0xbc, 0x3e, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x67, 0x00, 0x00, 0x00, 0x00, 0x01, 0xaa, 0xaa, 0xff, 0xff, 0xff, 0xff, 0xac, 0x0d, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x3f, 0x00, 0x00, 0x02]);
	const client = dgram.createSocket('udp4');
	client.send(blue_flash, 56700, lifxIP, (err) => {
	client.close();
	});
};
	// sends a "LIFX LAN Protocol" (56700) packet to flash light(s) red once, for 100ms (HalfSine WaveForm)
function red() {
	const dgram = require('dgram');
		// packet was captured via wireshark using unrelated program to generate, packet construction info can be found at https://lan.developer.lifx.com/docs/building-a-lifx-packet, incorporating code to do this automatically would be ideal but is beyond my abilities currently, feel free to do so yourself
	const red_flash = Buffer.from([0x39, 0x00, 0x00, 0x14, 0xbc, 0x3e, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x67, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xac, 0x0d, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x3f, 0x00, 0x00, 0x02]);
	const client = dgram.createSocket('udp4');
	client.send(red_flash, 56700, lifxIP, (err) => {
	client.close();
	});
};
  // this one to be sent on successful connection to websocket server (3 green flashes, 200ms each, otherwise same as above)
function green() {
	const dgram = require('dgram');
		// packet was captured via wireshark using unrelated program to generate, packet construction info can be found at https://lan.developer.lifx.com/docs/building-a-lifx-packet, incorporating code to do this automatically would be ideal but is beyond my abilities currently, feel free to do so yourself
	const green_flash = Buffer.from([0x39, 0x00, 0x00, 0x14, 0xf4, 0x82, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x67, 0x00, 0x00, 0x00, 0x00, 0x01, 0x55, 0x55, 0xff, 0xff, 0xff, 0xff, 0xac, 0x0d, 0xfa, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x40, 0x00, 0x00, 0x02]);
	const client = dgram.createSocket('udp4');
	client.send(green_flash, 56700, lifxIP, (err) => {
		client.close();
	});
};


	// connect to beatsaber-http-status websocket (runs on ws://localhost:6557/socket by default)
function connect() {
	var ip = 'localhost';
	var port = 6557;
	var socket = new WebSocket(`ws://localhost:6557/socket`);

		// listen for json messages (right now only noteCut, but it is possible to add other events here)
	socket.addEventListener("message", (message) => {
		var data = JSON.parse(message.data);
		var event = events[data.event];
		var noteCut = events[data.noteCut];
			// listen for noteCut event
		if (["noteCut"].some(a => a === data.event)) {
				// flash red for NoteA
			if (/NoteA/i.test(message.data)) {
				red();
			}
				// flash blue for NoteB
			if (/NoteB/i.test(message.data)) {
				blue();
			}
		}
	});
		// try to reconnect if connect lost, else stop client
	socket.addEventListener("close", () => {
		console.log("Failed to connect to server, retrying in 3 seconds");
		setTimeout(connect, 3000);
	});
};

	// set up command line user input
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

	// lets functions access IP user input
global.lifxIP

	// get IP to send packets to and start rolling
rl.question(['Please enter an IP or broadcast address to send lifx packets \n *for example: 192.168.1.255 \nLifx IP: '], function (value) {
	lifxIP = value
	console.log('\n',`LIFX packets will be sent to ${lifxIP}`);
	rl.close();
	green();
	console.log('\n', 'connected to beatsaber-http-status websocket', '\n', 'press ctrl-c to stop execution...', '\n');
});

	// run the main program
connect();