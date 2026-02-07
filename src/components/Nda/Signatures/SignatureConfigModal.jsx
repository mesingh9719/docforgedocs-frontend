import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Check, Settings, Shield } from 'lucide-react';

const SignatureConfigModal = ({ isOpen, onClose, onSave, initialData, parties }) => {
    const [config, setConfig] = useState({
        id: null,
        signeeName: '',
        signeeEmail: '',
        type: 'all', // all, draw, upload, text
        required: true,
        order: 1,
        placeholder: '',
        label: ''
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setConfig({
                id: initialData.id,
                signeeName: initialData.signeeName || '',
                signeeEmail: initialData.signeeEmail || '',
                type: initialData.type || 'all',
                required: initialData.required ?? true,
                order: initialData.order || 1,
                placeholder: initialData.placeholder || '',
                label: initialData.label || '',
                fieldType: initialData.fieldType || 'signature'
            });
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        onSave(config);
        onClose();
    };

    // Auto-fill when selecting a party preset
    const applyPartyPreset = (partyKey) => {
        if (!parties) return;

        if (partyKey === 'disclosing') {
            setConfig(prev => ({
                ...prev,
                signeeName: parties.disclosingSignatoryName || parties.disclosingPartyName || '',
                // Email might not be in the form data yet, but if it was, we'd map it here
            }));
        } else if (partyKey === 'receiving') {
            setConfig(prev => ({
                ...prev,
                signeeName: parties.receivingSignatoryName || parties.receivingPartyName || '',
            }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md pointer-events-auto flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Settings size={18} className="text-indigo-600" />
                                    Configure Signature
                                </h3>
                                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6 overflow-y-auto">
                                {/* Quick Presets */}
                                {parties && (
                                    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                                        <button
                                            onClick={() => applyPartyPreset('disclosing')}
                                            className="flex-1 text-xs font-medium py-1.5 px-3 rounded text-slate-600 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all text-center"
                                        >
                                            Disclosing Party
                                        </button>
                                        <button
                                            onClick={() => applyPartyPreset('receiving')}
                                            className="flex-1 text-xs font-medium py-1.5 px-3 rounded text-slate-600 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all text-center"
                                        >
                                            Receiving Party
                                        </button>
                                    </div>
                                )}

                                {/* Signee Info */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700">Signee Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            value={config.signeeName}
                                            onChange={e => setConfig({ ...config, signeeName: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700">Signee Email</label>
                                    <input
                                        type="email"
                                        value={config.signeeEmail}
                                        onChange={e => setConfig({ ...config, signeeEmail: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                {/* Order & Required */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Signing Order</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={config.order}
                                            onChange={e => setConfig({ ...config, order: parseInt(e.target.value) || 1 })}
                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Required?</label>
                                        <button
                                            onClick={() => setConfig({ ...config, required: !config.required })}
                                            className={`w-full py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${config.required
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            {config.required ? <Check size={16} /> : <span className="w-4 h-4 block border rounded-sm border-slate-300"></span>}
                                            {config.required ? 'Required' : 'Optional'}
                                        </button>
                                    </div>
                                </div>

                                {config.fieldType === 'text' && (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-700">Field Label</label>
                                            <input
                                                type="text"
                                                value={config.label}
                                                onChange={e => setConfig({ ...config, label: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                placeholder="e.g. Full Address"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-700">Placeholder Text</label>
                                            <input
                                                type="text"
                                                value={config.placeholder}
                                                onChange={e => setConfig({ ...config, placeholder: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                placeholder="e.g. 123 Main St..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Allowed Types - Only for Signature Fields */}
                                {(!config.fieldType || config.fieldType === 'signature') && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <Shield size={14} className="text-slate-400" />
                                            Allowed Signature Types
                                        </label>
                                        <select
                                            value={config.type}
                                            onChange={e => setConfig({ ...config, type: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                                        >
                                            <option value="all">Any (Draw, Type, Upload)</option>
                                            <option value="draw">Draw Only</option>
                                            <option value="text">Type Only</option>
                                            <option value="upload">Upload Only</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-xl">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all transform active:scale-95"
                                >
                                    Save Signature
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SignatureConfigModal;
