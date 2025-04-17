
async function createOffer(socket) {
	const video = document.getElementById("video");
	const startBtn = document.createElement('button');
	startBtn.innerText = 'Start!';
	document.body.appendChild(startBtn);
	startBtn.onclick = async () => {
		const peerConnection = new RTCPeerConnection({
			iceServers: [
				{ urls: 'stun:stun.l.google.com:19302' }
			]
		});
		const stream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
			audio: true
		});
		for (const track of stream.getTracks()) {
			peerConnection.addTrack(track, stream);
		}
		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);
		socket.emit('offer', offer);
		socket.on('answer', answer => {
			peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
		});
		peerConnection.onicecandidate = event => {
			if (event.candidate) {
				socket.emit('ice', event.candidate);
			}
		}
		video.srcObject = stream;
	}
}

async function joinOffer(socket) {
	const video = document.getElementById("video");
	const peerConnection = new RTCPeerConnection({
		iceServers: [
			{ urls: 'stun:stun.l.google.com:19302' }
		]
	});
	socket.on('offer', async offer => {
		await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answer);
		socket.emit('answer', answer);
		const startBtn = document.createElement('button');
		startBtn.innerText = 'Start!';
		document.body.appendChild(startBtn);
		startBtn.onclick = () => {
			video.play();
			document.body.removeChild(startBtn);
		}
	});
	socket.on('ice', async candidate => {
		await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
	});
	peerConnection.ontrack = event => {
		const [stream] = event.streams;
		video.srcObject = stream ?? new MediaStream([event.track]);
	};
}
