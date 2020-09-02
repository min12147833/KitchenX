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
function createWindow () {
  // 브라우저 창을 생성합니다.
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.removeMenu()
  win.loadFile('index.html');
}

// 이 메소드는 Electron의 초기화가 완료되고
// 브라우저 윈도우가 생성될 준비가 되었을때 호출된다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.whenReady().then(createWindow)

// 모든 윈도우가 닫히면 종료된다.
app.on('window-all-closed', () => {
  // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
  // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
  // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

io.on('connection', function (socket) {
    console.log('connect');
    var instanceId = socket.id;
    socket.on('msg', function (data) {
        console.log(data);
        socket.emit('recMsg', {comment: "로봇1번 출력" + ":" + data.comment+'\n'});
    })
    socket.on('msg4', function (data) {
      console.log(data);
      socket.emit('recMsg', {comment: "로봇1번 모터값" + ":" + data.comment+'\n'});
  })
    socket.on('msg5', function (data) {
      console.log(data);
      socket.emit('recMsg', {comment: "로봇2번 모터값" + ":" + data.comment+'\n'});
  })
    socket.on('msg1', function (data) {
      console.log(data);
      port.write('1');
      socket.emit('recMsg', {comment: "LED를 켭니다."+'\n'});
    })
    socket.on('msg2', function (data) {
    console.log(data);
    port.write('2');
    socket.emit('recMsg', {comment: "LED를 끕니다."+'\n'});
    })
    socket.on('msg3', function (data) {
    console.log(data);
    port.write('3');
    socket.emit('recMsg', {comment: "전송을 시작합니다."+'\n'});
    })
    var receivedData = "";
    port.on('data', function (data) {
      console.log('Data:'+ data)
      receivedData += data;
      sendData = receivedData;
      socket.emit('rec', 'Data:'+ data);
    })
});
