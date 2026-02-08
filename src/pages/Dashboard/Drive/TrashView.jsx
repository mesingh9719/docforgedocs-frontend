import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Trash2, RotateCcw, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatBytes } from './utils';

const TrashView = () => {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrash = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/drive/trash');
            setNodes(response.data.nodes);
        } catch (error) {
            console.error('Failed to fetch trash:', error);
            toast.error('Failed to load trash');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const handleRestore = async (nodeId) => {
        try {
            await axios.post(`/drive/nodes/${nodeId}/restore`);
            toast.success('Item restored');
            fetchTrash();
        } catch (error) {
            console.error('Restore failed:', error);
            toast.error('Failed to restore item');
        }
    };

    const handlePermanentDelete = async (nodeId) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;

        try {
            await axios.delete(`/drive/nodes/${nodeId}/force`);
            toast.success('Item permanently deleted');
            fetchTrash();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete item');
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-3">
                    <Trash2 className="text-slate-600" size={24} />
                    <h1 className="text-xl font-bold text-slate-800">Trash</h1>
                </div>
                <p className="text-sm text-slate-500 mt-1">Items will be permanently deleted after 30 days</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                    </div>
                ) : nodes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                            <Trash2 size={32} className="text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">Trash is empty</p>
                        <p className="text-sm">Deleted items will appear here</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Name</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">Size</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">Deleted</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nodes.map(node => (
                                    <tr key={node.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-medium text-slate-700">{node.name}</div>
                                                <span className="text-xs text-slate-400 uppercase">{node.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">
                                            {node.type === 'folder' ? '-' : formatBytes(node.size)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                                            {new Date(node.deleted_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleRestore(node.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium transition-colors"
                                                    title="Restore"
                                                >
                                                    <RotateCcw size={14} />
                                                    <span className="hidden sm:inline">Restore</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDelete(node.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                                                    title="Delete Forever"
                                                >
                                                    <XCircle size={14} />
                                                    <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrashView;
