const db = require('./src/main/db');
const { translateToArabic } = require('./src/main/services/translate');
const assert = require('assert');

console.log('--- STARTING BACKEND VERIFICATION ---');

// 1. Initialize DB
console.log('1. Initializing DB...');
db.init();
const initialProducts = db.getProducts();
console.log(`   Initial products count: ${initialProducts.length}`);

// 2. Add Product
console.log('2. Testing Add Product...');
const newProduct = {
    name_en: 'Test Item',
    name_ar: 'تست',
    price: 10.50,
    stock: 100,
    barcode: '123456'
};
const added = db.addProduct(newProduct);
assert.ok(added.id, 'Product should have an ID');
assert.strictEqual(added.name_en, 'Test Item');
console.log('   ✅ Add Product passed');

// 3. Update Product
console.log('3. Testing Update Product...');
const updatePayload = { ...added, price: 20.00 };
db.updateProduct(updatePayload);
const products = db.getProducts();
const updated = products.find(p => p.id === added.id);
assert.strictEqual(updated.price, 20.00, 'Price should be updated');
console.log('   ✅ Update Product passed');

// 4. Translate (Offline Stub)
console.log('4. Testing Translation (Offline Dict)...');
const translation = translateToArabic('apple').then(res => {
    // NOTE: depending on network, this might hit API or offline dict.
    // But 'apple' is in our OFFINE_DICT.
    console.log(`   Translated 'apple' -> '${res}'`);
    assert.ok(res, 'Should return a translation');
});

// 5. Create Invoice
console.log('5. Testing Create Invoice...');
const invoice = {
    customer_name: 'Test Customer',
    items: [{ ...updated, quantity: 2 }],
    total_amount: 40.00
};
const savedInvoice = db.createInvoice(invoice);
assert.ok(savedInvoice.id, 'Invoice should have an ID');
console.log('   ✅ Create Invoice passed');

// 6. Get Invoices
console.log('6. Testing Get History...');
const history = db.getInvoices();
const foundInv = history.find(i => i.id === savedInvoice.id);
assert.ok(foundInv, 'Should find the created invoice in history');
console.log('   ✅ History Retrieval passed');

// 7. Delete Product
console.log('7. Testing Delete Product...');
db.deleteProduct(added.id);
const finalProducts = db.getProducts();
const deleted = finalProducts.find(p => p.id === added.id);
assert.strictEqual(deleted, undefined, 'Product should be deleted');
console.log('   ✅ Delete Product passed');

setTimeout(() => {
    console.log('\n--- ALL BACKEND TESTS PASSED ---');
}, 1000);
