import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductManager from './components/ProductManager';
import POS from './components/POS';
import Invoices from './components/Invoices';
import Settings from './components/Settings';

function App() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                <nav className="bg-white shadow-sm p-4 flex justify-between items-center print:hidden">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-xl font-bold text-blue-600">POS Lite</Link>
                        {!isOnline && (
                            <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                🚫 Offline Mode
                            </span>
                        )}
                        {isOnline && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                🟢 Online
                            </span>
                        )}
                    </div>
                    <div className="space-x-4">
                        <Link to="/" className="hover:text-blue-600">Dashboard</Link>
                        <Link to="/products" className="hover:text-blue-600">Products</Link>
                        <Link to="/pos" className="hover:text-blue-600">New Sale</Link>
                        <Link to="/invoices" className="hover:text-blue-600">History</Link>
                        <Link to="/settings" className="hover:text-blue-600">Settings</Link>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<ProductManager />} />
                    <Route path="/pos" element={<POS />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
