const path = require('path');
const { app } = require('electron');
const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');

let db;

function init() {
  try {
    let userDataPath;
    if (app) {
      userDataPath = app.getPath('userData');
    } else {
      // Fallback for testing/Node environment
      userDataPath = __dirname;
    }
    const dbPath = path.join(userDataPath, 'pos_lite.json');
    console.log('Database path:', dbPath);

    const adapter = new FileSync(dbPath);
    db = low(adapter);

    // Set defaults if empty
    db.defaults({ products: [], invoices: [], settings: {} }).write();

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('DB Init Error:', err);
  }
}

function getDb() {
  if (!db) {
    init(); // Try lazy init
  }
  return db;
}

function getProducts() {
  return getDb().get('products').value();
}

function addProduct(product) {
  const newProduct = { ...product, id: Date.now() };
  getDb().get('products').push(newProduct).write();
  return newProduct;
}

function createInvoice(invoice) {
  // invoice: { items: [], total, customer_name, date }
  const newInvoice = { ...invoice, id: Date.now(), date: new Date().toISOString() };
  getDb().get('invoices').push(newInvoice).write();
  return newInvoice;
}

function saveSettings(settingsObj) {
  // Merge new settings with existing
  const current = getDb().get('settings').value() || {};
  getDb().set('settings', { ...current, ...settingsObj }).write();
  return getDb().get('settings').value();
}

function getSettings() {
  return getDb().get('settings').value() || {};
}

function saveSetting(key, value) {
  getDb().set(`settings.${key}`, value).write();
}

function getSetting(key) {
  return getDb().get(`settings.${key}`).value();
}

function updateProduct(product) {
  getDb().get('products')
    .find({ id: product.id })
    .assign(product)
    .write();
  return product;
}

function deleteProduct(id) {
  getDb().get('products')
    .remove({ id: id })
    .write();
}

function getInvoices() {
  return getDb().get('invoices').value() || [];
}

module.exports = {
  init,
  getDb,
  getProducts,
  addProduct,
  createInvoice,
  saveSettings,
  getSettings,
  saveSetting,
  getSetting,
  updateProduct,
  deleteProduct,
  getInvoices
};
