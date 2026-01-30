import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Filter, Plus, FileText, Clock, CheckCircle,
    MoreVertical, AlertCircle, Calendar, User, Download,
    Send, Trash2, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SignatureDocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock Data - Replace with API call later
    useEffect(() => {
        setTimeout(() => {
            setDocuments([
                {
                    id: '1',
                    title: 'NDA - TechSynchronic & Client A',
                    status: 'completed',
                    signers: [
                        { name: 'John Doe', email: 'john@example.com', signed: true },
                        { name: 'Jane Smith', email: 'jane@techsynchronic.com', signed: true }
                    ],
                    createdAt: '2024-03-15T10:00:00Z',
                    updatedAt: '2024-03-16T14:30:00Z'
                },
                {
                    id: '2',
                    title: 'Service Agreement - Q2 Project',
                    status: 'pending',
                    signers: [
                        { name: 'Mike Ross', email: 'mike@pearman.com', signed: true },
                        { name: 'Harvey Specter', email: 'harvey@pearman.com', signed: false }
                    ],
                    createdAt: '2024-03-20T09:15:00Z',
                    updatedAt: '2024-03-20T09:15:00Z'
                },
                {
                    id: '3',
                    title: 'Freelance Contract - Design Work',
                    status: 'draft',
                    signers: [],
                    createdAt: '2024-03-25T11:45:00Z',
                    updatedAt: '2024-03-25T12:00:00Z'
                }
            ]);
            setIsLoading(false);
        }, 800);
    }, []);

    // Filter Logic
    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit"><CheckCircle size={12} /> Completed</span>;
            case 'pending':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit"><Clock size={12} /> In Progress</span>;
            case 'draft':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 w-fit"><FileText size={12} /> Draft</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 w-fit">{status}</span>;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Signature Documents</h1>
                    <p className="text-slate-500 mt-1">Manage and track all documents sent for signature</p>
                </div>
                <Link
                    to="/signatures"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 hover:shadow-md active:transform active:scale-95"
                >
                    <Plus size={18} />
                    New Document
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['all', 'pending', 'completed', 'draft'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize whitespace-nowrap ${statusFilter === status
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredDocs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Signers</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredDocs.map((doc) => (
                                    <motion.tr
                                        key={doc.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{doc.title}</p>
                                                    <p className="text-xs text-slate-500">ID: #{doc.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(doc.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {doc.signers.length > 0 ? (
                                                    doc.signers.map((signer, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white ${signer.signed ? 'bg-emerald-500' : 'bg-slate-400'
                                                                }`}
                                                            title={`${signer.name} (${signer.signed ? 'Signed' : 'Pending'})`}
                                                        >
                                                            {signer.name.charAt(0)}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-slate-400 italic">No signers</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(doc.updatedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors" title="View">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors" title="Download">
                                                    <Download size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No documents found</h3>
                        <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignatureDocumentList;
