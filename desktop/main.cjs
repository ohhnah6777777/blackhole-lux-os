const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

const APP_URL = process.env.BLACKHOLE_URL || "https://blackhole-lux-os.lovable.app";

function createShell() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    backgroundColor: "#000000",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadURL(APP_URL);
  return win;
}

// Each browser tab in Blackhole OS opens a real Chromium window with native
// back/forward history handled by Chromium itself.
function createBrowserWindowFor(url) {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    backgroundColor: "#000000",
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  win.loadURL(url);
  win.webContents.setWindowOpenHandler(({ url: next }) => {
    createBrowserWindowFor(next);
    return { action: "deny" };
  });
  return win;
}

ipcMain.handle("blackhole:open-window", (_event, url) => {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return false;
  createBrowserWindowFor(url);
  return true;
});

ipcMain.handle("blackhole:open-external", (_event, url) => shell.openExternal(url));

app.whenReady().then(() => {
  createShell();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createShell();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
