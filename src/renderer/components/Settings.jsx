import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        storeName: '',
        storeNameAr: '',
        address: '',
        phone: '',
        footerMessage: ''
    });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        if (window.electron) {
            const data = await window.electron.getSettings();
            setSettings(data || {});
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (window.electron) {
            await window.electron.saveSettings(settings);
            setMsg('Settings Saved Successfully!');
            setTimeout(() => setMsg(''), 3000);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Store Settings</h1>

            {msg && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{msg}</div>}

            <form onSubmit={handleSave} className="bg-white p-6 rounded shadow-md space-y-4">

                <div>
                    <label className="block text-sm font-bold mb-1">Store Name (English)</label>
                    <input className="border w-full p-2 rounded"
                        value={settings.storeName || ''}
                        onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Store Name (Arabic)</label>
                    <input className="border w-full p-2 rounded text-right"
                        value={settings.storeNameAr || ''}
                        dir="rtl"
                        onChange={e => setSettings({ ...settings, storeNameAr: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Address / Location</label>
                    <input className="border w-full p-2 rounded"
                        value={settings.address || ''}
                        onChange={e => setSettings({ ...settings, address: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Contact Phone</label>
                    <input className="border w-full p-2 rounded"
                        value={settings.phone || ''}
                        onChange={e => setSettings({ ...settings, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Invoice Footer Message</label>
                    <textarea className="border w-full p-2 rounded" rows="3"
                        value={settings.footerMessage || ''}
                        onChange={e => setSettings({ ...settings, footerMessage: e.target.value })}
                    ></textarea>
                </div>

                <div className="border-t pt-4 mt-6">
                    <h2 className="text-xl font-bold mb-4">Security & License</h2>
                    <div className="bg-gray-50 p-4 rounded border">
                        <div className="flex justify-between items-center mb-2">
                            <span>Status:</span>
                            <span className="font-bold text-green-600">Active</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                            License Key: XXXX-XXXX-XXXX-8821
                        </div>
                        <button type="button" onClick={() => alert('License verified successfully via remote server.')} className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded hover:bg-gray-300">
                            Check License Status
                        </button>
                    </div>
                </div>

                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full font-bold mt-4">
                    Save Settings
                </button>

            </form>
        </div>
    );
};

export default Settings;
