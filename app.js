const mqtt = require('mqtt')

if (process.argv.length != 4) {
  console.log("Usage: node app.js URI CONNECTIONS")
  process.exit()
}
const uri = process.argv[2]
const conns = parseInt(process.argv[3])

for(let i = 0; i < conns; i++) {
  const client = mqtt.connect(uri, { clean: false, clientId: 'device' + i })

  client.on('connect', function () {
    client.subscribe('q' + i, { qos: 2 }, function (err) {
      if (!err) {
        client.publish('stats', 'Hello mqtt')
      }
    })

    setInterval(() => {
      client.publish('stats', 'Hello from ' + i)
    }, 30000);
  })

  client.on('error', function(err) {
    console.log('ERROR: ' + err.toString())
    client.end();
  });

  client.on('offline', function() {
    console.log('Offline')
    client.end();
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
  })
}
