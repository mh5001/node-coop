# Remote gamepad and screenshare
Emulate gamepad on the host. Only tested with Linux.

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

## Note
On the host, you need to click the host button. Click start on the host once everyone had join.