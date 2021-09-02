import { ipcRenderer } from 'electron'

export const openDialog = () => {
  debugger
  ipcRenderer.send('openSelectFileDialog')
}

export const ipcRendererSend = (eventName, args) => {
  console.log(`向主进程发消息: ${eventName}`)
  ipcRenderer.send(eventName, args)
}

/**
 * 渲染进程向主进程发送通知
 * @param {String} eventName 事件名称
 * @param  {any} args 参数
 * return: promise
 */
export const ipcRendererInvoke = (eventName, args) => ipcRenderer.invoke(eventName, args)

export const openSelectFileDialog = () => ipcRendererSend('openSelectFileDialog',)