
const mqtt = require('mqtt')
const fs = require('fs')

if (process.argv.length != 4) {
  console.log("Usage: node app.js URI INTERVAL")
  process.exit()
}
const uri = process.argv[2]
const interval = parseInt(process.argv[3])

function start() {
  const client = mqtt.connect(uri, {
    clean: true,
    connectTimeout: 60000,
    reconnectPeriod: 0,
    rejectUnauthorized: false
  })

  client.on('connect', function () {
    console.log('Connected')
    client.end()
  })

  client.on('error', function(err) {
    console.log('ERROR: ', err)
    client.end();
  });
  client.on('close', function() {
    console.log('Close')
  })
}

setInterval(start, interval)
