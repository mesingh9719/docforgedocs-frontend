import React, { useState, useMemo } from 'react';
import { Braces, Plus, X, Trash2, Copy, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllVariables } from '../../../utils/variableRegistry';

const VariableManager = ({ variables = {}, onAdd, onRemove, onInsert }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [newVal, setNewVal] = useState('');
    const [newType, setNewType] = useState('string');
    const [copiedKey, setCopiedKey] = useState(null);

    const handleAdd = () => {
        if (!newKey.trim()) {
            toast.error('Please enter a variable key');
            return;
        }

        // Sanitize key (e.g. "client_discount_rate")
        const safeKey = newKey.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '_');

        if (onAdd) {
            onAdd(safeKey, {
                type: newType,
                value: newVal,
                label: newLabel.trim() || safeKey,
            });
            toast.success(`Variable {{${safeKey}}} added!`);
        }

        setNewKey('');
        setNewLabel('');
        setNewVal('');
        setNewType('string');
        setIsAdding(false);
    };

    const handleCopy = (key, e) => {
        if (e) e.stopPropagation();
        const tag = `{{${key}}}`;
        navigator.clipboard.writeText(tag);
        setCopiedKey(key);
        toast.success(`Copied ${tag}`);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-white font-sans text-xs">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700">
                    <Braces size={16} className="text-indigo-600" />
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Template Variables</span>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAdding(!isAdding)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 rounded-lg transition"
                >
                    <Plus size={13} />
                    <span>Add Custom</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Add Custom Variable Form */}
                {isAdding && (
                    <div className="bg-slate-50 border border-indigo-200 rounded-xl p-3.5 space-y-3 shadow-xs">
                        <span className="font-bold text-slate-800 text-xs block">New Custom Variable</span>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Variable Key</label>
                            <input
                                type="text"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 font-mono"
                                placeholder="e.g. project_milestone"
                                value={newKey}
                                onChange={(e) => setNewKey(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Display Label</label>
                            <input
                                type="text"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                                placeholder="e.g. Project Milestone"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Type</label>
                                <select
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                                >
                                    <option value="string">Text</option>
                                    <option value="number">Number</option>
                                    <option value="currency">Currency</option>
                                    <option value="date">Date</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Default Value</label>
                                <input
                                    type="text"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                                    placeholder="Value"
                                    value={newVal}
                                    onChange={(e) => setNewVal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="flex-1 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                            >
                                Save Variable
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Custom Variables Section */}
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                        Custom Template Variables ({Object.keys(variables).length})
                    </h4>

                    {Object.keys(variables).length === 0 && !isAdding ? (
                        <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 bg-slate-50/40">
                            <p className="text-[11px]">No custom variables defined.</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Click "Add Custom" above to create one.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {Object.entries(variables).map(([key, config]) => {
                                const isCopied = copiedKey === key;
                                return (
                                    <div
                                        key={key}
                                        className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-200 shadow-2xs group flex items-start justify-between gap-2"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                                    {`{{${key}}}`}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400 uppercase">
                                                    {config.type || 'text'}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 font-medium text-[11px] truncate">
                                                {config.label || key}
                                            </p>
                                            {config.value && (
                                                <p className="text-slate-400 text-[10px] truncate mt-0.5">
                                                    Default: <span className="text-slate-600">{config.value}</span>
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                onClick={(e) => handleCopy(key, e)}
                                                title="Copy Tag"
                                                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                            >
                                                {isCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                            </button>

                                            {onRemove && (
                                                <button
                                                    type="button"
                                                    onClick={() => onRemove(key)}
                                                    title="Delete Variable"
                                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* System Registry Guide */}
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-900">
                        <Info size={13} />
                        <span>System Variables Available</span>
                    </div>
                    <p className="text-[10px] text-indigo-800/80 leading-relaxed">
                        Standard namespaces like <code>{'{{company.*}}'}</code>, <code>{'{{client.*}}'}</code>, <code>{'{{document.*}}'}</code>, and <code>{'{{invoice.*}}'}</code> are always available and resolve automatically from workspace business data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VariableManager;
