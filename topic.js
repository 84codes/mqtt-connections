const mqtt = require('mqtt')
const fs = require('fs')
const os = require('os')

if (process.argv.length < 6) {
  console.log("Usage: node app.js URI CONNECTIONS QOS (0 or 1) CLEAN (true or false) [PREFIX (defaults to HOSTNAME)]")
  process.exit()
}
const uri = process.argv[2]
const conns = parseInt(process.argv[3])
const qos = parseInt(process.argv[4])
const clean = parseInt(process.argv[5])
const prefix = process.argv[6] || os.hostname()

function start(i) {
  const client = mqtt.connect(uri, {
    clean: clean,
    clientId: prefix + i.toString(),
    connectTimeout: 60000,
    keepalive: 0,
    reconnectPeriod: 30000,
    rejectUnauthorized: false
  })
  const topic = `${prefix}_${i.toString()}`

  client.on('connect', function () {
    console.log('Connected')
    client.subscribe([topic], { qos: qos }, function (err) {
      if (err) {
        console.log('Could not subscribe: ', err)
      }
    })
    setInterval(() => {
      client.publish(topic, 'Hello from ' + topic)
    }, 30000)
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
