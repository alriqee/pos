import React from 'react';

const InvoiceTemplate = ({ invoice, settings }) => {
    if (!invoice) return null;

    const { customer_name, items, total_amount, date } = invoice;
    // items is array of { name_en, name_ar, price, quantity, total }

    return (
        <div className="p-8 bg-white text-black max-w-2xl mx-auto border print:border-none" id="printable-invoice">
            <div className="text-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold uppercase">{settings?.storeName || "My Store"}</h1>
                {settings?.storeNameAr && <h2 className="text-xl dir-rtl">{settings.storeNameAr}</h2>}
                <p className="text-sm mt-1">{settings?.address}</p>
                <p className="text-sm">{settings?.phone}</p>
            </div>

            <div className="flex justify-between mb-6 text-sm">
                <div>
                    <p><strong>Date:</strong> {new Date(date).toLocaleString()}</p>
                    <p><strong>Invoice ID:</strong> #{invoice.id}</p>
                </div>
                <div>
                    <p className="text-right"><strong>Customer:</strong> {customer_name || 'Walk-in'}</p>
                </div>
            </div>

            <table className="w-full mb-8 border-collapse text-sm">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className="py-2">
                                <div className="font-bold">{item.name_en}</div>
                                <div className="text-xs text-gray-600 rtl" dir="rtl">{item.name_ar}</div>
                            </td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">{Number(item.price).toFixed(2)}</td>
                            <td className="text-right py-2">{Number(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t-2 border-black font-bold text-lg">
                        <td colSpan="3" className="text-right py-4">NET TOTAL:</td>
                        <td className="text-right py-4">{Number(total_amount).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="text-center text-gray-600 text-xs mt-12 border-t pt-4">
                <p>{settings?.footerMessage || "Thank you for your visit!"}</p>
            </div>
        </div>
    );
};

export default InvoiceTemplate;
