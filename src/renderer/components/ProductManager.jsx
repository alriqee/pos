import React, { useState, useEffect } from 'react';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name_en: '', name_ar: '', price: '', stock: '', barcode: '', id: null });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            if (window.electron) {
                const data = await window.electron.getProducts();
                setProducts(data);
            }
        } catch (err) {
            console.error("Failed to load products", err);
        }
    };

    const handleNameEnChange = async (e) => {
        const val = e.target.value;
        setForm(prev => ({ ...prev, name_en: val }));
    };

    const translateName = async () => {
        if (!form.name_en) return;
        setLoading(true);
        try {
            const ar = await window.electron.translate(form.name_en);
            setForm(prev => ({ ...prev, name_ar: ar }));
        } catch (error) {
            console.error("Translation error", error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name_en || !form.price) return;

        const payload = {
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock) || 0
        };

        try {
            if (window.electron) {
                if (isEditing) {
                    await window.electron.updateProduct(payload);
                } else {
                    delete payload.id; // ensure new ID is generated
                    await window.electron.addProduct(payload);
                }
            }

            resetForm();
            loadProducts();
        } catch (error) {
            console.error("Save product failed", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            if (window.electron) {
                await window.electron.deleteProduct(id);
                loadProducts();
            }
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setForm({ name_en: '', name_ar: '', price: '', stock: '', barcode: '', id: null });
        setIsEditing(false);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Product Management</h2>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Product Name (EN)</label>
                    <div className="flex gap-2">
                        <input
                            className="border p-2 w-full rounded"
                            value={form.name_en}
                            onChange={handleNameEnChange}
                            onBlur={translateName}
                            placeholder="e.g. Cola"
                        />
                        <button type="button" onClick={translateName} className="bg-blue-100 p-2 rounded text-sm hover:bg-blue-200">🌐</button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Product Name (AR)</label>
                    <input
                        className="border p-2 w-full rounded text-right"
                        value={form.name_ar}
                        onChange={e => setForm({ ...form, name_ar: e.target.value })}
                        dir="rtl"
                        placeholder="...مثلاً كولا"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Price</label>
                    <input
                        type="number" step="0.01"
                        className="border p-2 w-full rounded"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Stock</label>
                    <input
                        type="number"
                        className="border p-2 w-full rounded"
                        value={form.stock}
                        onChange={e => setForm({ ...form, stock: e.target.value })}
                    />
                </div>

                <div className="col-span-2 flex gap-2">
                    <button type="submit" className={`px-6 py-2 rounded text-white font-bold transition ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 font-bold">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow rounded">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Name (EN)</th>
                            <th className="p-3 text-right">Name (AR)</th>
                            <th className="p-3 text-right">Price</th>
                            <th className="p-3 text-right">Stock</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                                <td className="p-3 text-gray-500">{p.id}</td>
                                <td className="p-3 font-medium">{p.name_en}</td>
                                <td className="p-3 text-right">{p.name_ar}</td>
                                <td className="p-3 text-right text-green-700 font-bold">${Number(p.price).toFixed(2)}</td>
                                <td className="p-3 text-right">{p.stock}</td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button onClick={() => handleEdit(p)} className="bg-yellow-100 text-yellow-700 p-2 rounded hover:bg-yellow-200">
                                        ✏️
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200">
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-400">
                                    No products found. Add one above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManager;
