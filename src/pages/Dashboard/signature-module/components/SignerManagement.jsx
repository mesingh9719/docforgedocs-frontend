import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, User, Trash2, Edit2, GripVertical, Shield } from 'lucide-react';

const SignerManagement = ({ signers, onUpdateSigners }) => {
    const [newSigner, setNewSigner] = useState({
        name: '',
        email: '',
        role: 'signer',
        order: signers.length + 1
    });
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const addSigner = () => {
        if (newSigner.name.trim() && newSigner.email.trim()) {
            onUpdateSigners([
                ...signers,
                {
                    id: Date.now().toString(),
                    ...newSigner,
                    order: signers.length + 1
                }
            ]);
            setNewSigner({ name: '', email: '', role: 'signer', order: signers.length + 2 });
            setShowAddForm(false);
        }
    };

    const removeSigner = (id) => {
        const updatedSigners = signers
            .filter(s => s.id !== id)
            .map((s, index) => ({ ...s, order: index + 1 }));
        onUpdateSigners(updatedSigners);
    };

    const updateSigner = (id, updates) => {
        onUpdateSigners(signers.map(s => s.id === id ? { ...s, ...updates } : s));
        setEditingId(null);
    };

    const moveSignerUp = (index) => {
        if (index === 0) return;
        const newSigners = [...signers];
        [newSigners[index - 1], newSigners[index]] = [newSigners[index], newSigners[index - 1]];
        newSigners.forEach((s, i) => s.order = i + 1);
        onUpdateSigners(newSigners);
    };

    const moveSignerDown = (index) => {
        if (index === signers.length - 1) return;
        const newSigners = [...signers];
        [newSigners[index], newSigners[index + 1]] = [newSigners[index + 1], newSigners[index]];
        newSigners.forEach((s, i) => s.order = i + 1);
        onUpdateSigners(newSigners);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Signers</h3>
                    <p className="text-sm text-slate-500">Manage who needs to sign this document</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <UserPlus size={18} />
                    Add Signer
                </button>
            </div>

            {/* Add Signer Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={newSigner.name}
                                        onChange={(e) => setNewSigner({ ...newSigner, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        value={newSigner.email}
                                        onChange={(e) => setNewSigner({ ...newSigner, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Role
                                </label>
                                <select
                                    value={newSigner.role}
                                    onChange={(e) => setNewSigner({ ...newSigner, role: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                >
                                    <option value="signer">Signer</option>
                                    <option value="approver">Approver</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={addSigner}
                                    className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewSigner({ name: '', email: '', role: 'signer', order: signers.length + 1 });
                                    }}
                                    className="px-4 py-2 bg-white text-slate-600 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Signers List */}
            <div className="space-y-2">
                {signers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus size={32} className="text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">No signers added yet</p>
                        <p className="text-sm text-slate-500 mt-1">Click "Add Signer" to get started</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {signers.map((signer, index) => (
                            <motion.div
                                key={signer.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="group p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Drag Handle */}
                                    <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                        <GripVertical size={18} className="text-slate-400" />
                                    </div>

                                    {/* Order Badge */}
                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {signer.order}
                                    </div>

                                    {/* Signer Info */}
                                    <div className="flex-1 min-w-0">
                                        {editingId === signer.id ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    defaultValue={signer.name}
                                                    onBlur={(e) => updateSigner(signer.id, { name: e.target.value })}
                                                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                                                />
                                                <input
                                                    type="email"
                                                    defaultValue={signer.email}
                                                    onBlur={(e) => updateSigner(signer.id, { email: e.target.value })}
                                                    className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-slate-800 truncate">
                                                    {signer.name}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {signer.email}
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Role Badge */}
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        signer.role === 'signer' 
                                            ? 'bg-blue-100 text-blue-700'
                                            : signer.role === 'approver'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-100 text-slate-700'
                                    }`}>
                                        {signer.role}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => moveSignerUp(index)}
                                            disabled={index === 0}
                                            className="p-1.5 hover:bg-slate-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move up"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveSignerDown(index)}
                                            disabled={index === signers.length - 1}
                                            className="p-1.5 hover:bg-slate-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move down"
                                        >
                                            ↓
                                        </button>
                                        <button
                                            onClick={() => setEditingId(signer.id)}
                                            className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} className="text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => removeSigner(signer.id)}
                                            className="p-1.5 hover:bg-red-100 rounded transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={14} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Info Box */}
            {signers.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                        <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-800">
                            <p className="font-medium mb-1">Signing Order</p>
                            <p className="text-blue-600">
                                Signers will receive the document in the order shown above. Each signer must complete their signature before the next person can sign.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignerManagement;