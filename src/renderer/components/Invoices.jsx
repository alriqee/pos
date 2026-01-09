import React, { useState, useEffect } from 'react';
import InvoiceTemplate from './InvoiceTemplate';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (window.electron) {
            const inv = await window.electron.getInvoices();
            const sett = await window.electron.getSettings();
            // Sort by date desc
            setInvoices(inv.sort((a, b) => new Date(b.date) - new Date(a.date)));
            setSettings(sett);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (selectedInvoice) {
        return (
            <div className="fixed inset-0 bg-gray-100 overflow-auto z-50 flex flex-col items-center p-8">
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-3xl mb-4">
                    <InvoiceTemplate invoice={selectedInvoice} settings={settings} />
                </div>
                <div className="flex gap-4 print:hidden">
                    <button onClick={handlePrint} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition">
                        Print Invoice
                    </button>
                    <button onClick={() => setSelectedInvoice(null)} className="bg-gray-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-600 transition">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Sales History</h1>

            <div className="bg-white shadow rounded overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">Invoice ID</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-right">Items</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.id} className="border-t hover:bg-blue-50 transition cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                                <td className="p-4 font-mono text-sm text-gray-500">#{inv.id}</td>
                                <td className="p-4">{new Date(inv.date).toLocaleString()}</td>
                                <td className="p-4">{inv.customer_name || 'Walk-in'}</td>
                                <td className="p-4 text-right">{inv.items.length}</td>
                                <td className="p-4 text-right font-bold text-green-700">${Number(inv.total_amount).toFixed(2)}</td>
                                <td className="p-4 text-center">
                                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-10 text-center text-gray-400">
                                    No sales found yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;
