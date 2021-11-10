const { BrowserWindow, Menu, screen } = require("electron");
const { getConnection } = require("./database");

let window;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  window = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  window.loadFile("src/views/index.html");
  window.maximize();

  // window.once("ready-to-show", () => {
  //   window.show();
  // });

  // const mainMenu = Menu.buildFromTemplate(templateMenu);
  // Menu.setApplicationMenu(mainMenu);
}

const templateMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "New Product",
        accelerator: "ctrl+n",
        click() {
          console.log("dasd");
        },
      },
    ],
  },
];

module.exports = {
  createWindow,
};
