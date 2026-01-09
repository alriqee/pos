const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');
const { translateToArabic } = require('./services/translate');
const { checkLockStatus, isLockedLocally } = require('./services/security');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        // In production, load the built file
        win.loadFile(path.join(__dirname, '../../dist/index.html'));
    }
}

app.whenReady().then(async () => {
    db.init();

    // Security Check
    const locked = await checkLockStatus();
    if (locked) {
        console.log('App is locked by remote/local policy');
    }

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// IPC Handlers
ipcMain.handle('db:get-products', () => {
    return db.getProducts();
});

ipcMain.handle('db:add-product', async (event, product) => {
    return db.addProduct(product);
});

ipcMain.handle('db:create-invoice', async (event, invoice) => {
    return db.createInvoice(invoice);
});

ipcMain.handle('db:save-settings', async (event, settings) => {
    return db.saveSettings(settings);
});

ipcMain.handle('db:get-settings', async () => {
    return db.getSettings();
});

ipcMain.handle('db:update-product', async (event, product) => {
    return db.updateProduct(product);
});

ipcMain.handle('db:delete-product', async (event, id) => {
    return db.deleteProduct(id);
});

ipcMain.handle('db:get-invoices', async () => {
    return db.getInvoices();
});

ipcMain.handle('api:translate', async (event, text) => {
    return await translateToArabic(text);
});

ipcMain.handle('security:get-status', () => {
    return { locked: isLockedLocally() };
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
