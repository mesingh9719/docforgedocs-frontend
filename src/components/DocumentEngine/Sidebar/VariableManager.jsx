import React, { useState } from 'react';
import { Braces, Plus, X } from 'lucide-react';

const VariableManager = ({ variables, onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newKey, setNewKey] = useState('');
    const [newVal, setNewVal] = useState('');

    const handleAdd = () => {
        if (!newKey) return;

        // Simple sanitization
        const safeKey = newKey.replace(/[^a-zA-Z0-9_]/g, '');

        onAdd(safeKey, {
            type: 'text',
            value: newVal,
            label: safeKey // Default label same as key
        });

        setNewKey('');
        setNewVal('');
        setIsAdding(false);
    };

    return (
        <div className="h-1/3 min-h-[250px] border-t border-slate-200 flex flex-col bg-slate-50">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2 text-slate-700">
                    <Braces size={16} />
                    <span className="font-semibold text-sm">Variables</span>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-1 hover:bg-slate-100 rounded text-indigo-600"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isAdding && (
                    <div className="text-sm bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                        <input
                            className="w-full mb-2 p-1 border-b border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                            placeholder="Key (e.g. client_name)"
                            value={newKey}
                            onChange={e => setNewKey(e.target.value)}
                            autoFocus
                        />
                        <input
                            className="w-full mb-3 p-1 border-b border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                            placeholder="Default Value"
                            value={newVal}
                            onChange={e => setNewVal(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleAdd} className="flex-1 py-1 bg-indigo-600 text-white text-xs rounded">Add</button>
                            <button onClick={() => setIsAdding(false)} className="flex-1 py-1 bg-slate-100 text-slate-600 text-xs rounded">Cancel</button>
                        </div>
                    </div>
                )}

                {Object.entries(variables).length === 0 && !isAdding && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No variables defined.</p>
                )}

                {Object.entries(variables).map(([key, config]) => (
                    <div key={key} className="bg-white p-2 rounded border border-slate-200 text-sm group">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-indigo-600 px-1 bg-indigo-50 rounded">{`{{${key}}}`}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{config.type}</span>
                        </div>
                        <p className="text-slate-600 truncate text-xs pl-1">{config.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VariableManager;
