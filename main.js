const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 700,
    height: 550,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },

  });

  win.removeMenu();
  win.loadFile("index.html");
  ipcMain.on("load-page", (event, page) => {
    win.loadFile(page);
  });  
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });


  ipcMain.handle("take-screenshot", async () => {
    const image = await win.webContents.capturePage(); // Capture the window content
    const screenshotPath = path.join(app.getPath("desktop"), `screenshot-${Date.now()}.png`);
    fs.writeFileSync(screenshotPath, image.toPNG());
    return screenshotPath;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});