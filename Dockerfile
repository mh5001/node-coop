FROM node:alpine
WORKDIR /app
RUN apk update
RUN apk add python3 py3-pip libevdev supervisor
COPY . .
COPY supervisord.conf /etc/supervisord.conf
RUN pip install -r requirements.txt --break-system-packages
RUN npm install

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
