import React, { useState } from 'react';
import { X } from 'lucide-react';

const RenameModal = ({ node, onClose, onConfirm }) => {
    const [newName, setNewName] = useState(node.name);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim() && newName !== node.name) {
            onConfirm(node.id, newName.trim());
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Rename {node.type}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter new name"
                        autoFocus
                        onFocus={(e) => {
                            // Select filename without extension
                            const lastDot = e.target.value.lastIndexOf('.');
                            if (lastDot > 0 && node.type === 'file') {
                                e.target.setSelectionRange(0, lastDot);
                            } else {
                                e.target.select();
                            }
                        }}
                    />

                    <div className="flex items-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!newName.trim() || newName === node.name}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Rename
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameModal;
