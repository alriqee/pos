import React, { useState, useEffect } from 'react';
import InvoiceTemplate from './InvoiceTemplate';

const POS = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);
    const [settings, setSettings] = useState({});
    const [showInvoice, setShowInvoice] = useState(false);
    const [lastInvoice, setLastInvoice] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (window.electron) {
            const prodData = await window.electron.getProducts();
            const setDocs = await window.electron.getSettings();
            setProducts(prodData || []);
            setSettings(setDocs || {});
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const invoice = {
            customer_name: "Walk-in Customer", // Can add input for this later
            items: cart,
            total_amount: cartTotal,
            date: new Date().toISOString()
        };

        if (window.electron) {
            const savedInvoice = await window.electron.createInvoice(invoice);
            setLastInvoice(savedInvoice);
            setShowInvoice(true);
            setCart([]); // Clear cart
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const closeInvoice = () => {
        setShowInvoice(false);
        setLastInvoice(null);
    };

    // Filter products
    const filteredProducts = products.filter(p =>
        p.name_en.toLowerCase().includes(search.toLowerCase()) ||
        (p.name_ar && p.name_ar.includes(search))
    );

    if (showInvoice && lastInvoice) {
        return (
            <div className="fixed inset-0 bg-gray-100 overflow-auto z-50 flex flex-col items-center p-8">
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-3xl mb-4">
                    <InvoiceTemplate invoice={lastInvoice} settings={settings} />
                </div>
                <div className="flex gap-4 print:hidden">
                    <button onClick={handlePrint} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition">
                        Print Invoice
                    </button>
                    <button onClick={closeInvoice} className="bg-gray-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-600 transition">
                        Close / New Sale
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-80px)]">
            {/* LEFT: Product Grid */}
            <div className="w-2/3 p-6 flex flex-col bg-gray-50 border-r">
                <input
                    className="w-full p-4 text-lg border rounded-xl shadow-sm mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Search Products (English or Arabic)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus
                />

                <div className="grid grid-cols-3 gap-4 overflow-y-auto content-start">
                    {filteredProducts.map(p => (
                        <div
                            key={p.id}
                            onClick={() => addToCart(p)}
                            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg hover:border-blue-500 border border-transparent transition h-32 flex flex-col justify-between"
                        >
                            <h3 className="font-bold text-gray-800 line-clamp-2">{p.name_en}</h3>
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-gray-500 rtl" dir="rtl">{p.name_ar}</span>
                                <span className="font-bold text-blue-600 text-lg">${Number(p.price).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-3 text-center text-gray-400 mt-10">
                            No products found. Go to Products page to add some.
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Cart */}
            <div className="w-1/3 bg-white p-6 flex flex-col shadow-xl z-10">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Current Sale</h2>

                <div className="flex-1 overflow-y-auto space-y-3">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div className="flex-1">
                                <div className="font-bold">{item.name_en}</div>
                                <div className="text-xs text-gray-500">${item.price} x {item.quantity}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => updateQty(item.id, 1)} className="bg-gray-200 px-2 rounded text-xs hover:bg-gray-300">+</button>
                                    <button onClick={() => updateQty(item.id, -1)} className="bg-gray-200 px-2 rounded text-xs hover:bg-gray-300">-</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-2">×</button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            Cart is empty
                        </div>
                    )}
                </div>

                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold mb-4">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className={`w-full py-4 rounded-xl text-white font-bold text-xl transition ${cart.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg'}`}
                    >
                        CHECKOUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;
