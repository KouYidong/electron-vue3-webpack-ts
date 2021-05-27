const path = require('path')
const url = require('url')
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 在渲染进程中可以直接使用 node
      nodeIntegration: true,
      // https://www.electronjs.org/docs/tutorial/context-isolation#context-isolation
      contextIsolation: false
    }
  })

  // 这里 load 的地址基于 webpack.main.config.js 中 output 中的 path 和 filename
  // pathToFileURL: 返回文件URL对象。
  // const filePath:string = url.pathToFileURL(path.join(process.cwd(), './dist/index.html')).href
  // 如果路径或者参数中含有中文，需要对路径进行编码处理
  // win.loadURL(encodeURI(filePath))
  win.loadURL('http://localhost:8080/')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})