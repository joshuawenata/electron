const electron = require('electron')

const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = electron

let mainWindow, addWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    mainWindow.loadURL(`file://${__dirname}/main.html`)
    mainWindow.on('closed', () => app.quit())

    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

function createAddWindow() {
    addWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        },
        width: 300,
        height: 200,
        title: 'Add New Todo'
    })
    addWindow.loadURL(`file://${__dirname}/add.html`)
    addWindow.on('closed', () => addWindow = null)
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send("todo:add", todo)
    addWindow.close()
})

const menuTemplate = [
    {
        label: 'Action',
        submenu: [
            { 
                label: 'New Todo',
                click(){
                    createAddWindow()
                }
            },
            {
                label: 'Clear Todo',
                click(){
                    mainWindow.webContents.send("todo:clear")
                }
            },
            { 
                label: 'Exit', 
                accelerator: 'CTRL+Q',
                click(){
                    app.quit()
                } 
            }
        ]
    }
]

if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label: 'View',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: 'CTRL+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            }
        ]
    })
}