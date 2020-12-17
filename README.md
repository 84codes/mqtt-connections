# mqtt-connections

Quick and easy way to run on Ubuntu:
```M=mqtts://username:passwd@server-name.rmq.cloudamqp.com/
git clone https://github.com/84codes/mqtt-connections.git
cd mqtt-connections/
sudo apt install npm
npm install mqtt --save
ulimit -n 100000
node app.js $M 10000```
