const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("blackhole", {
  platform: process.platform,
  openWindow: (url) => ipcRenderer.invoke("blackhole:open-window", url),
  openExternal: (url) => ipcRenderer.invoke("blackhole:open-external", url),
});
