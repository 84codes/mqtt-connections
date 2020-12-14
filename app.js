const mqtt = require('mqtt')

if (process.argv.length != 4) {
  console.log("Usage: node app.js URI CONNECTIONS")
  process.exit()
}
const uri = process.argv[2]
const conns = parseInt(process.argv[3])

for(let i = 0; i < conns; i++) {
  const client = mqtt.connect('mqtt://guest:guest@localhost')

  client.on('connect', function () {
    client.subscribe('presence', function (err) {
      if (!err) {
        client.publish('presence', 'Hello mqtt')
      }
    })
  })

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    client.end()
  })
}
