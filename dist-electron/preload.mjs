"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("api", {
  listAutos: () => electron.ipcRenderer.invoke("autos:list"),
  createAuto: (auto) => electron.ipcRenderer.invoke("auto:create", auto),
  updateAuto: (auto) => electron.ipcRenderer.invoke("autos:update", auto),
  deleteAuto: (id) => electron.ipcRenderer.invoke("autos:delete", id),
  listVidriosByAuto: (autoId) => electron.ipcRenderer.invoke("vidrios:listByAuto", autoId),
  createVidrio: (vidrio) => electron.ipcRenderer.invoke("vidrios:create", vidrio),
  updateVidrio: (vidrio) => electron.ipcRenderer.invoke("vidrios:update", vidrio),
  deleteVidrio: (id) => electron.ipcRenderer.invoke("vidrios:delete", id)
});
