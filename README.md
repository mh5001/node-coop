# Remote gamepad and screenshare
Emulate gamepad on the host. Screenshare with WebRTC, making everyone available to play local co-op games.

Only tested with Linux.

## Requirements
Docker

## Installation
git clone and cd
```sh
docker build . -t emulator
```

## Run
```sh
docker run -d -p 8080:8080 --device /dev/uinput -v /dev/input:/dev/input --cap-add SYS_ADMIN --rm --name emulator emulator
```
Then go to browser `http://localhost:8080`. Everyone on the same network can now join.
## Note
On the host, you need to click the host button. Click start on the host once everyone had join.