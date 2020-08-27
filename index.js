const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('COM17', {
  baudRate: 115200,

})
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
var io = require('socket.io').listen(8080);
  // Switches the port into "flowing mode"
//윈도우 객체의 전역으로 선언합니다. 그렇지 않으면 윈도우가 자동으로 닫는다.
//자바 스크립트 객체가 가비지 수집 될 때 자동으로 닫는다.
let win

function createWindow () {
  // 브라우저 창을 만듭니다.
  win = new BrowserWindow({width: 800, height: 600})

  //index.html를 로드합니다.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 개발툴을 사용하기 위해 오픈한다.
  win.webContents.openDevTools()

  // 윈도우가 닫힐 때 발생되는 이벤트다.
  win.on('closed', () => {
    win = null
  })
}

//사용 준비가 완료되면 윈도우를 연다.
app.on('ready', createWindow)

// 모든 창이 닫히면 종료한다.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
io.on('connection', function (socket) {
    console.log('connect');
    var instanceId = socket.id;
    socket.on('msg', function (data) {
        console.log(data);
        socket.emit('recMsg', {comment: instanceId + ":" + data.comment+'\n'});
    })
});
port.on('data', function (data) {
  console.log('Data:'+ data)

})
