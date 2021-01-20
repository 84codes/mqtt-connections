const mqtt = require('mqtt')
const fs = require('fs')
const os = require('os')
const crypto = require("crypto");

if (process.argv.length < 5) {
  console.log("Usage: node app.js URI CONNECTIONS [PREFIX (defaults to HOSTNAME)] STRINGLENGTH")
  process.exit()
}
const uri = process.argv[2]
const conns = parseInt(process.argv[3])
const prefix = process.argv[4] || os.hostname()
const messageStr = crypto.randomBytes(parseInt(process.argv[5])/2).toString('hex');

function start(i) {
  const client = mqtt.connect(uri, {
    clean: false,
    clientId: prefix + i.toString(),
    connectTimeout: 60000,
    keepalive: 0,
    reconnectPeriod: 30000,
    rejectUnauthorized: false
  })
  const topic = `${prefix}_${i.toString()}`

  client.on('connect', function () {
    console.log('Connected')
    client.subscribe([topic], { qos: 1 }, function (err) {
      if (err) {
        console.log('Could not subscribe: ', err)
      }
    })
    setInterval(() => {
      client.publish('stats', messageStr + i)
    }, 20)
  })

  client.on('error', function(err) {
    console.log('ERROR: ', err)
    client.end();
  });

  client.on('offline', function() {
    //client.end();
    console.log('Offline')
  });

  client.on('close', function() {
    console.log('Close')
  })

  client.on('reconnect', function() {
    console.log('Reconnect')
  })

  client.on('message', function (topic, message) {
    console.log('MSG: ', message.toString())
  })
}

for(let i = 0; i < conns; i++) {
  start(i)
}
