const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getProducts: () => ipcRenderer.invoke('db:get-products'),
    addProduct: (product) => ipcRenderer.invoke('db:add-product', product),
    updateProduct: (product) => ipcRenderer.invoke('db:update-product', product),
    deleteProduct: (id) => ipcRenderer.invoke('db:delete-product', id),
    createInvoice: (invoice) => ipcRenderer.invoke('db:create-invoice', invoice),
    getInvoices: () => ipcRenderer.invoke('db:get-invoices'),
    saveSettings: (settings) => ipcRenderer.invoke('db:save-settings', settings),
    getSettings: () => ipcRenderer.invoke('db:get-settings'),
    translate: (text) => ipcRenderer.invoke('api:translate', text),
    getSecurityStatus: () => ipcRenderer.invoke('security:get-status'),
});
