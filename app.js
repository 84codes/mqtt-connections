const mqtt = require('mqtt')
const fs = require('fs')
const os = require('os')

if (process.argv.length != 4) {
  console.log("Usage: node app.js URI CONNECTIONS")
  process.exit()
}
const uri = process.argv[2]
const conns = parseInt(process.argv[3])
const hostname = os.hostname()

function start(i) {
  const client = mqtt.connect(uri, { clean: false, clientId: hostname + i.toString(), reconnectPeriod: i, rejectUnauthorized: false })
  const topic = `${hostname}_${i.toString()}`

  client.on('connect', function () {
    console.log('Connected')
    client.subscribe([topic], { qos: 1 }, function (err) {
      if (err) {
        console.log('Could not subscribe: ', err)
      }
    })
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
