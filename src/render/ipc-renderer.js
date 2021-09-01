import { ipcRenderer } from 'electron'

export const openDialog = () => {
  debugger
  ipcRenderer.send('openSelectFileDialog')
}

export const ipcRendererSend = (eventName, args) => {
  console.log(`向主进程发消息: ${eventName}`)
  ipcRenderer.send(eventName, args)
}

export const openSelectFileDialog = () => ipcRendererSend('openSelectFileDialog', )