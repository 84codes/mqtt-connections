const mqtt = require('mqtt')
const fs = require('fs')

if (process.argv.length != 4) {
  console.log("Usage: node app.js URI CONNECTIONS")
  process.exit()
}
const uri = process.argv[2]
const conns = parseInt(process.argv[3])
const hostname = fs.existsSync('/etc/hostname') ? fs.readFileSync('/etc/hostname').toString().trim() : Math.random().toString(36).substring(7)

for(let i = 0; i < conns; i++) {
  const client = mqtt.connect(uri, { clean: false, clientId: hostname + i.toString(), reconnectPeriod: 1000 })
  const topic = `${hostname}_${i.toString()}`

  client.on('connect', function () {
    client.subscribe([topic], { qos: 1 }, function (err) {
      if (!err) {
        client.publish('stats', 'Hello mqtt')
      }
    })
    setTimeout(() => {
      setInterval(() => {
        client.publish('stats', 'Hello from ' + i)
      }, 30000);
    }, Math.floor(Math.random() * 30000))
  })

  client.on('error', function(err) {
    client.end();
  });

  client.on('offline', function() {
    client.end();
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log('MSG: ', message.toString())
  })
}
