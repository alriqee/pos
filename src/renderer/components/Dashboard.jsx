import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [securityStatus, setSecurityStatus] = useState({ locked: false });

    useEffect(() => {
        if (window.electron) {
            window.electron.getSecurityStatus().then(setSecurityStatus);
        }
    }, []);

    if (securityStatus.locked) {
        return (
            <div className="flex h-screen items-center justify-center bg-red-50">
                <div className="text-center p-8 bg-white shadow-xl rounded-xl">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">🔒 SYSTEM LOCKED</h1>
                    <p className="text-gray-600">Please contact support to unlock this terminal.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">POS Lite Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Link to="/pos" className="block transform transition hover:scale-105">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg h-48 flex flex-col justify-between">
                        <span className="text-4xl">🛒</span>
                        <h2 className="text-2xl font-bold">New Sale</h2>
                        <p className="text-blue-100">Create invoice and checkout</p>
                    </div>
                </Link>

                <Link to="/products" className="block transform transition hover:scale-105">
                    <div className="bg-white p-6 rounded-xl shadow-md h-48 flex flex-col justify-between border border-gray-100">
                        <span className="text-4xl">📦</span>
                        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                        <p className="text-gray-500">Manage inventory & translations</p>
                    </div>
                </Link>

                <Link to="/invoices" className="block transform transition hover:scale-105">
                    <div className="bg-white p-6 rounded-xl shadow-md h-48 flex flex-col justify-between border border-gray-100">
                        <span className="text-4xl">📜</span>
                        <h2 className="text-2xl font-bold text-gray-800">History</h2>
                        <p className="text-gray-500">View past sales & invoices</p>
                    </div>
                </Link>

                <Link to="/settings" className="block transform transition hover:scale-105">
                    <div className="bg-white p-6 rounded-xl shadow-md h-48 flex flex-col justify-between border border-gray-100">
                        <span className="text-4xl">⚙️</span>
                        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                        <p className="text-gray-500">Configure store & lock</p>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default Dashboard;
