import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

const CreateFolderModal = ({ onClose, onConfirm, parentFolder = null }) => {
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!folderName.trim()) {
            setError('Folder name cannot be empty');
            return;
        }

        if (folderName.includes('/') || folderName.includes('\\')) {
            setError('Folder name cannot contain / or \\');
            return;
        }

        onConfirm(folderName.trim());
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <FolderPlus className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Create New Folder</h3>
                            {parentFolder && (
                                <p className="text-sm text-slate-500">in {parentFolder}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => {
                                setFolderName(e.target.value);
                                setError('');
                            }}
                            className={`w-full px-4 py-3 bg-slate-50 border ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
                                } rounded-lg focus:ring-2 focus:border-transparent transition-all`}
                            placeholder="Enter folder name"
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!folderName.trim()}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            Create Folder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFolderModal;
