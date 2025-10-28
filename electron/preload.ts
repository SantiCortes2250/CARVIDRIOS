import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...


  
})


contextBridge.exposeInMainWorld('api', {
  
   listAutos: () => ipcRenderer.invoke('autos:list'),
  createAuto: (auto: unknown) => ipcRenderer.invoke('auto:create', auto),
  updateAuto: (auto: unknown) => ipcRenderer.invoke('autos:update', auto),
  deleteAuto: (id: string | number) => ipcRenderer.invoke('autos:delete', id),
  listVidriosByAuto: (autoId: string | number) => ipcRenderer.invoke('vidrios:listByAuto', autoId),
  createVidrio: (vidrio: unknown) => ipcRenderer.invoke('vidrios:create', vidrio),
  updateVidrio: (vidrio: unknown) => ipcRenderer.invoke('vidrios:update', vidrio),
  deleteVidrio: (id: string | number) => ipcRenderer.invoke('vidrios:delete', id),

 
});