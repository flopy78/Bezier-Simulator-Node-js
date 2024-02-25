const {app,BrowserWindow} = require('electron');


function createWindow(devtools) {
    /*function to generate the window and display the html page, and eventually to display the devtools*/
    const window = new BrowserWindow({width : 800, height : 700});
    window.loadFile('index.html');
    if (devtools) window.webContents.openDevTools();
}

//launches the app
app.whenReady().then(() => {createWindow(false);})