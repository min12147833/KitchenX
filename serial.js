const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('COM17', {
  baudRate: 115200,

})
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
  // Switches the port into "flowing mode"
  port.on('data', function (data) {
    console.log('Data:'+ data)
 
})
  