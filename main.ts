const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 在渲染进程中可以直接使用 node
      nodeIntegration: true
    }
  })

  // 这里 load 的地址基于 webpack.main.config.js 中 output 中的 path 和 filename
  win.loadFile('../index.html')
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