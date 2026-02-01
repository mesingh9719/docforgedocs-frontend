import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Plus, FileText, Clock, CheckCircle,
    MoreVertical, AlertCircle, Calendar, User, Download,
    Send, Trash2, Eye, History, X, ChevronDown, CheckSquare, Square,
    Archive, RefreshCw, Mail, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SignatureDocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'name'

    // Selection & Actions
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [activeDrawer, setActiveDrawer] = useState(null); // 'audit' | 'preview' | null
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Fetch Data
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/signatures');
            const data = response.data.data || response.data;
            setDocuments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast.error("Failed to refresh documents");
        } finally {
            setIsLoading(false);
        }
    };

    // Advanced Filter & Sort Logic
    const processedDocs = useMemo(() => {
        let docs = [...documents];

        // 1. Filter by Status
        if (statusFilter !== 'all') {
            docs = docs.filter(doc => {
                let status = 'draft';
                if (doc.status === 'completed') status = 'completed';
                else if (doc.signers?.length > 0) status = 'pending';
                return status === statusFilter;
            });
        }

        // 2. Search (Name, Signer Email)
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            docs = docs.filter(doc =>
                (doc.name || '').toLowerCase().includes(lowerQuery) ||
                doc.signers?.some(s => s.email.toLowerCase().includes(lowerQuery))
            );
        }

        // 3. Sorting
        docs.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
            return 0;
        });

        return docs;
    }, [documents, statusFilter, searchQuery, sortBy]);

    // Handlers
    const toggleSelect = (id) => {
        setSelectedDocs(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedDocs.length === processedDocs.length) {
            setSelectedDocs([]);
        } else {
            setSelectedDocs(processedDocs.map(d => d.id));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(prev => prev.filter(d => d.id !== id));
            setSelectedDocs(prev => prev.filter(d => d !== id)); // Remove from selection if selected
            toast.success('Document deleted');
        } catch (error) {
            toast.error('Failed to delete document');
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedDocs.length} documents?`)) return;
        // In real app, call bulk delete API. simulating here:
        try {
            // await api.post('/documents/bulk-delete', { ids: selectedDocs });
            setDocuments(prev => prev.filter(d => !selectedDocs.includes(d.id)));
            setSelectedDocs([]);
            toast.success(`${selectedDocs.length} Documents deleted`);
        } catch (err) {
            toast.error("Bulk delete failed");
        }
    };

    const handleResendReminder = async (docId) => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1000)), // Simulate API
            {
                loading: 'Sending reminders...',
                success: 'Reminders sent to pending signers!',
                error: 'Failed to send'
            }
        );
    };

    // Helpers
    const getStatusInfo = (doc) => {
        if (doc.status === 'completed') return { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle };
        if (doc.signers?.length > 0) return { label: 'In Progress', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Clock };
        return { label: 'Draft', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: FileText };
    };

    const getProgress = (signers) => {
        if (!signers?.length) return 0;
        const signed = signers.filter(s => s.status === 'signed').length;
        return Math.round((signed / signers.length) * 100);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6 font-sans text-slate-800">
            {/* Top Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Signature Requests
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your digital agreements and track progress</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDocuments}
                        className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm hover:shadow"
                        title="Refresh List"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <Link
                        to="/signatures"
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        New Request
                    </Link>
                </div>
            </div>

            {/* Stats Overview (Optional Polish) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Pending Signatures', value: documents.filter(d => d.signers?.length > 0 && d.status !== 'completed').length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Completed', value: documents.filter(d => d.status === 'completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Documents', value: documents.length, color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <FileText size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 sticky top-4 z-20 backdrop-blur-xl bg-white/80 supports-[backdrop-filter]:bg-white/60">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by document name, signer email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                    <div className="bg-slate-100 p-1 rounded-xl flex">
                        {['all', 'pending', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${statusFilter === status
                                    ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-2" />

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 hover:border-slate-300 transition-colors cursor-pointer appearance-none pr-8 relative"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden relative min-h-[500px]">

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {selectedDocs.length > 0 && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6"
                        >
                            <span className="text-sm font-semibold text-slate-300 border-r border-slate-700 pr-4">
                                {selectedDocs.length} Selected
                            </span>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white" title="Download All">
                                    <Download size={18} />
                                </button>
                                <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white" title="Archive">
                                    <Archive size={18} />
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="p-2 hover:bg-red-900/50 rounded-full transition-colors text-red-300 hover:text-red-200"
                                    title="Delete Selected"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <button
                                onClick={() => setSelectedDocs([])}
                                className="ml-2 text-xs font-bold text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 w-12">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {selectedDocs.length > 0 && selectedDocs.length === processedDocs.length ? (
                                            <CheckSquare size={20} className="text-indigo-600" />
                                        ) : (
                                            <Square size={20} />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Progress</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Signers</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</th>
                                <th className="px-6 py-4 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="p-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                                            <p className="text-slate-500 font-medium">Loading your documents...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : processedDocs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-24 text-center">
                                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText size={40} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-700">No documents found</h3>
                                        <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                processedDocs.map((doc) => {
                                    const status = getStatusInfo(doc);
                                    const progress = getProgress(doc.signers);
                                    const isSelected = selectedDocs.includes(doc.id);

                                    return (
                                        <motion.tr
                                            key={doc.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                                            className={`group transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}
                                        >
                                            <td className="px-6 py-5">
                                                <button
                                                    onClick={() => toggleSelect(doc.id)}
                                                    className={`transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}
                                                >
                                                    {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                                </button>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${doc.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'
                                                        }`}>
                                                        {doc.status === 'completed' ? <CheckCircle size={24} /> : <FileText size={24} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => { setSelectedDoc(doc); setActiveDrawer('preview'); }}>
                                                            {doc.name || "Untitled Document"}
                                                        </p>
                                                        <span className="text-xs text-slate-400 font-mono">ID: #{doc.id.toString().slice(-6)}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="space-y-2">
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.color}`}>
                                                        <status.icon size={12} />
                                                        {status.label}
                                                    </div>

                                                    {doc.signers?.length > 0 && (
                                                        <div className="w-32">
                                                            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-medium">
                                                                <span>Progress</span>
                                                                <span>{progress}%</span>
                                                            </div>
                                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex -space-x-3">
                                                    {doc.signers?.slice(0, 4).map((s, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-9 h-9 rounded-full border-[3px] border-white flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-slate-100 relative group/avatar ${s.status === 'signed' ? 'bg-emerald-500' : s.status === 'viewed' ? 'bg-amber-400' : 'bg-indigo-300'
                                                                }`}
                                                            title={`${s.name} (${s.email}) - ${s.status}`}
                                                        >
                                                            {s.name.charAt(0).toUpperCase()}
                                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                                                {s.status === 'signed' && <CheckCircle size={10} className="text-emerald-500 fill-emerald-100" />}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {doc.signers?.length > 4 && (
                                                        <div className="w-9 h-9 rounded-full border-[3px] border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                                            +{doc.signers.length - 4}
                                                        </div>
                                                    )}
                                                    {(!doc.signers || doc.signers.length === 0) && (
                                                        <span className="text-xs text-slate-400 italic">No signers</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="text-sm text-slate-600 font-medium">
                                                    {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {format(new Date(doc.updated_at), 'h:mm a')}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {doc.status !== 'completed' && doc.signers?.some(s => s.status !== 'signed') && (
                                                        <button
                                                            onClick={() => handleResendReminder(doc.id)}
                                                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                                            title="Resend Signature Request"
                                                        >
                                                            <Mail size={16} />
                                                        </button>
                                                    )}

                                                    {doc.status === 'completed' && (
                                                        <Link
                                                            to={`/signatures/${doc.id}/view-signed`}
                                                            className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                                                            title="View Signed PDF"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                    )}

                                                    <button
                                                        onClick={() => { setSelectedDoc(doc); setActiveDrawer('audit'); }}
                                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                                                        title="View History"
                                                    >
                                                        <History size={16} />
                                                    </button>

                                                    <div className="h-4 w-px bg-slate-200 mx-1" />

                                                    <button
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Side Drawer (Shared for Audit & Preview) */}
            <AnimatePresence>
                {activeDrawer && selectedDoc && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                            onClick={() => setActiveDrawer(null)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {activeDrawer === 'audit' ? 'Audit Trail' : 'Document Details'}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-0.5">{selectedDoc.name}</p>
                                </div>
                                <button
                                    onClick={() => setActiveDrawer(null)}
                                    className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-slate-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {activeDrawer === 'preview' ? (
                                    <div className="space-y-6">
                                        {/* Quick Actions */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedDoc.status === 'completed' && (
                                                <Link
                                                    to={`/signatures/${selectedDoc.id}/view-signed`}
                                                    className="col-span-2 flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-200"
                                                >
                                                    <Eye size={18} /> View Signed Document
                                                </Link>
                                            )}
                                            {selectedDoc.pdf_url && (
                                                <a
                                                    href={selectedDoc.pdf_url}
                                                    target="_blank"
                                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 rounded-xl font-medium transition-all"
                                                >
                                                    <FileText size={18} /> Original PDF
                                                </a>
                                            )}
                                            {selectedDoc.final_pdf_url && (
                                                <a
                                                    href={selectedDoc.final_pdf_url}
                                                    download
                                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 rounded-xl font-medium transition-all"
                                                >
                                                    <Download size={18} /> Signed PDF
                                                </a>
                                            )}
                                        </div>

                                        {/* Meta Data */}
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Status</span>
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${selectedDoc.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                                                    }`}>
                                                    {selectedDoc.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Created On</span>
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {new Date(selectedDoc.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Last Activity</span>
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {new Date(selectedDoc.updated_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Signers List */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <User size={18} className="text-indigo-600" />
                                                Signers ({selectedDoc.signers?.length || 0})
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedDoc.signers?.map((signer, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${signer.status === 'signed' ? 'bg-emerald-500' : 'bg-indigo-400'
                                                            }`}>
                                                            {signer.name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-slate-800 text-sm">{signer.name}</p>
                                                            <p className="text-xs text-slate-400">{signer.email}</p>
                                                        </div>
                                                        {signer.status === 'signed' ? (
                                                            <CheckCircle size={18} className="text-emerald-500" />
                                                        ) : (
                                                            <button
                                                                onClick={() => handleResendReminder(selectedDoc.id)}
                                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded transition-colors"
                                                            >
                                                                Resend
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Audit Log Content
                                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-10">
                                        <div className="relative pl-8">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 ring-4 ring-white" />
                                            <p className="text-xs font-bold text-slate-500 uppercase">Created</p>
                                            <p className="text-sm font-medium text-slate-800 mt-0.5">Document Created</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(selectedDoc.created_at).toLocaleString()}</p>
                                        </div>

                                        {selectedDoc.signers?.map((signer, idx) => (
                                            <div key={idx} className="relative pl-8">
                                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ring-4 ring-white ${signer.status === 'signed' ? 'bg-emerald-500' : 'bg-indigo-300'
                                                    }`} />
                                                <p className="text-xs font-bold text-slate-500 uppercase">{signer.status === 'signed' ? 'Signed' : 'Pending'}</p>
                                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mt-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User size={14} className="text-slate-400" />
                                                        <span className="text-sm font-semibold text-slate-700">{signer.name}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">{signer.email}</p>
                                                    {signer.status === 'signed' && (
                                                        <div className="mt-2 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded inline-flex items-center gap-1">
                                                            <CheckCircle size={10} /> Verified & Timestamped
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2 ml-1">
                                                    {new Date(signer.updated_at).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SignatureDocumentList;
