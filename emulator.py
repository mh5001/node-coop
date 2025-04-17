import socket
import threading
from vgamepad import VDS4Gamepad

mappings = {}
axesMappings = {}
KEYS = [
	1 << 5,
	1 << 6,
	1 << 4,
	1 << 7,
	1 << 8,
	1 << 9,
	1 << 10,
	1 << 11,
	1 << 12,
	1 << 13,
	1 << 14,
	1 << 15,
	0x0,
	0x4,
	0x6,
	0x2
]

def handle_client(client_socket, client_address):
	print(f'Connection from {client_address} has been established.')
	port = client_address[1]
	mappings[port] = VDS4Gamepad()
	axesMappings[port] = [0.0, 0.0, 0.0, 0.0]
	with client_socket:
		while True:
			data = client_socket.recv(1024)
			if not data:
				del mappings[port]
				del axesMappings[port]
				break
			chunks = data.decode().split('\n')
			for c in chunks:
				if c == '':
					continue
				type, index, key = c.split(' ')
				index = int(index)
				pad = mappings[port]
				axes = axesMappings[port]
				if type == 'b':
					if key == '1':
						if index < 12:
							if index in [6, 7]:
								if index == 6:
									pad.left_trigger_float(2.0)
								else:
									pad.right_trigger_float(2.0)
							pad.press_button(button=KEYS[index])
						else:
							pad.directional_pad(direction=KEYS[index])
					else:
						if index < 12:
							if index == 6:
								pad.left_trigger_float(0.0)
							elif index == 7:
								pad.right_trigger_float(0.0)
							pad.release_button(button=KEYS[index])
						else:
							pad.directional_pad(direction=0x8)
				if type == 'a':
					axes[index] = float(key)
					pad.left_joystick_float(axes[0], axes[1])
					pad.right_joystick_float(axes[2], axes[3])
			pad.update()


def start_server(host='127.0.0.1', port=65432):
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
		server_socket.bind((host, port))
		server_socket.listen()
		print(f'Server listening on {host}:{port}')

		while True:
			client_socket, client_address = server_socket.accept()
			client_thread = threading.Thread(target=handle_client, args=(client_socket, client_address))
			client_thread.start()

if __name__ == '__main__':
	start_server()
