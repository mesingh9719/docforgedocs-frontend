import StatusBadge from '../../../components/ui/StatusBadge';
import { usePermissions } from '../../../hooks/usePermissions';
import './signatures.css';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
    Search, Plus, FileText, CheckCircle, Clock,
    Download, Trash2, Eye, History, X, CheckSquare, Square,
    Archive, RefreshCw, Mail, User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import DashboardPage from '../../../components/Dashboard/DashboardPage';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';

// Sub-components
import SignatureTableRow from './components/SignatureTableRow';
import SignatureMobileCard from './components/SignatureMobileCard';

const SignatureDocumentList = () => {
    const { can } = usePermissions();
    const canDelete = can('document.delete');
    const [loadError, setLoadError] = useState(false);
    const [actionBusy, setActionBusy] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Selection & Actions
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Fetch Data
    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        setLoadError(false);
        try {
            const response = await api.get('/signatures');
            const data = response.data.data || response.data;
            setDocuments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching documents:", error);
            setLoadError(true);
            toast.error("Failed to refresh documents");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // Advanced Filter & Sort Logic
    const processedDocs = useMemo(() => {
        let docs = [...documents];

        // 1. Filter by Status
        if (statusFilter !== 'all') {
            docs = docs.filter(doc => {
                if (statusFilter === 'pending') return ['sent', 'viewed'].includes(doc.status);
                return doc.status === statusFilter;
            });
        }

        // 2. Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            docs = docs.filter(doc =>
                (doc.name || '').toLowerCase().includes(lowerQuery) ||
                doc.signers?.some(s => (s.email || '').toLowerCase().includes(lowerQuery))
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
    const toggleSelect = useCallback((id) => {
        setSelectedDocs(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedDocs.length === processedDocs.length) {
            setSelectedDocs([]);
        } else {
            setSelectedDocs(processedDocs.map(d => d.id));
        }
    }, [selectedDocs.length, processedDocs]);

    const handleDelete = useCallback(async (id) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(prev => prev.filter(d => d.id !== id));
            setSelectedDocs(prev => prev.filter(d => d !== id));
            toast.success('Document deleted');
        } catch {
            toast.error('Failed to delete document');
        }
    }, []);

    const handleBulkDelete = async () => {
        if (!canDelete || actionBusy || !confirm(`Move ${selectedDocs.length} documents to trash?`)) return;
        setActionBusy(true);
        try {
            await api.post('/documents/bulk-delete', { ids: selectedDocs });
            setDocuments(prev => prev.filter(d => !selectedDocs.includes(d.id)));
            setSelectedDocs([]);
            toast.success('Selected documents moved to trash');
        } catch {
            toast.error('Could not delete documents. Please try again.');
        } finally { setActionBusy(false); }
    };

    const handleResendReminder = useCallback(async (docId, email) => {
        const doc = documents.find(item => item.id === docId);
        const recipients = email ? [email] : [...new Set((doc?.signers || []).filter(signer => signer.status !== 'signed' && signer.email).map(signer => signer.email))];
        if (!recipients.length || actionBusy) return;
        setActionBusy(true);
        try {
            const results = await Promise.allSettled(recipients.map(recipient => api.post(`/documents/${docId}/remind`, { email: recipient })));
            const sent = results.filter(result => result.status === 'fulfilled').length;
            if (sent === recipients.length) toast.success('Reminder requests accepted');
            else toast.error(`${sent} of ${recipients.length} reminder requests accepted. Please try again for the remaining signers.`);
        } finally { setActionBusy(false); }
    }, [documents, actionBusy]);

    const drawerRef = useRef(null);
    useEffect(() => {
        if (!activeDrawer) return;
        const previousFocus = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        drawerRef.current?.querySelector('button')?.focus();
        const onKey = event => {
            if (event.key === 'Escape') setActiveDrawer(null);
            if (event.key !== 'Tab') return;
            const items = drawerRef.current?.querySelectorAll('button:not(:disabled), a[href]');
            if (!items?.length) return;
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previousFocus?.focus(); };
    }, [activeDrawer]);

    const getProgress = useCallback((signers) => {
        if (!signers?.length) return 0;
        const signed = signers.filter(s => s.status === 'signed').length;
        return Math.round((signed / signers.length) * 100);
    }, []);

    return (
        <DashboardPage className="signatures-module">
            <DashboardPageHeader
                title="Signature Requests"
                subtitle="Track every request, follow up with signers, and access completed agreements."
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDocuments}
                        className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm hover:shadow"
                        aria-label="Refresh signature requests" disabled={isLoading}
                        title="Refresh List"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <Link
                        to="/signatures"
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all "
                    >
                        <Plus size={20} />
                        New Request
                    </Link>
                </div>
            </DashboardPageHeader>

            <div className="signature-metrics grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Pending Signatures', value: documents.filter(d => ['sent', 'viewed'].includes(d.status)).length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Completed', value: documents.filter(d => d.status === 'completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Documents', value: documents.length, color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{isLoading ? '…' : loadError ? '—' : stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <FileText size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="signature-toolbar">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        aria-label="Search signature requests"
                        placeholder="Search by document name or signer email…"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSelectedDocs([]); }}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-100 focus:border-slate-300 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                    />
                </div>

                <div className="signature-filter-row">
                    <div className="signature-status-tabs">
                        {['all', 'draft', 'prepared', 'pending', 'completed', 'declined', 'cancelled', 'expired'].map((status) => (
                            <button
                                key={status}
                                aria-pressed={statusFilter === status}
                                onClick={() => { setStatusFilter(status); setSelectedDocs([]); }}
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${statusFilter === status
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block" />

                    <select
                        aria-label="Sort signature requests"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name (A-Z)</option>
                    </select>
                </div>
            </div>

            <div className="signature-results" role="status"><span>{isLoading ? 'Loading requests…' : loadError ? 'Requests unavailable' : `${processedDocs.length} of ${documents.length} requests`}</span>{(searchQuery || statusFilter !== 'all') && <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); setSelectedDocs([]); }}>Clear filters</button>}</div>
            {loadError && <div role="alert" className="signature-error">Couldn’t refresh signature requests. Use Refresh to try again.{documents.length > 0 && ' Previously loaded requests are shown below.'}</div>}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden relative min-h-[300px]">
                <AnimatePresence>
                    {selectedDocs.length > 0 && (
                        <Motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="signature-selection"
                        >
                            <span>{selectedDocs.length} selected</span>
                            {canDelete && <button onClick={handleBulkDelete} disabled={actionBusy} className="text-red-700 flex items-center gap-2"><Trash2 size={16} />{actionBusy ? 'Working…' : 'Move to trash'}</button>}
                            <button onClick={() => setSelectedDocs([])}>Clear selection</button>
                        </Motion.div>
                    )}
                </AnimatePresence>

                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-3 w-12 text-center">
                                    <button
                                        aria-label="Select all matching requests" aria-pressed={processedDocs.length > 0 && selectedDocs.length === processedDocs.length}
                                        onClick={toggleSelectAll}
                                        className="text-slate-400 hover:text-indigo-600 transition-colors flex justify-center"
                                    >
                                        {selectedDocs.length > 0 && selectedDocs.length === processedDocs.length ? (
                                            <CheckSquare size={18} className="text-indigo-600" />
                                        ) : (
                                            <Square size={18} />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Name</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Progress</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Signers</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</th>
                                <th className="px-6 py-3 w-32"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="p-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                                            <p className="text-slate-500 font-medium text-sm">Loading documents...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : processedDocs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-24 text-center">
                                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText size={32} className="text-slate-300" strokeWidth={1} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">{loadError ? 'Requests unavailable' : 'No requests found'}</h3>
                                        <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                processedDocs.map((doc) => (
                                    <SignatureTableRow
                                        key={doc.id}
                                        doc={doc}
                                        isSelected={selectedDocs.includes(doc.id)}
                                        toggleSelect={toggleSelect}
                                        canDelete={canDelete} actionBusy={actionBusy}
                                        getProgress={getProgress}
                                        handleResendReminder={handleResendReminder}
                                        handleDelete={handleDelete}
                                        setSelectedDoc={setSelectedDoc}
                                        setActiveDrawer={setActiveDrawer}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="xl:hidden">
                    {isLoading ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                            <p className="text-slate-500 text-sm">Loading documents...</p>
                        </div>
                    ) : processedDocs.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={32} className="text-slate-300" strokeWidth={1} />
                            </div>
                            <p className="text-slate-500 font-medium">{loadError ? 'Requests unavailable' : 'No requests found'}.</p>
                        </div>
                    ) : (
                        processedDocs.map((doc) => (
                            <SignatureMobileCard
                                key={doc.id}
                                doc={doc}
                                canDelete={canDelete} actionBusy={actionBusy}
                                getProgress={getProgress}
                                setSelectedDoc={setSelectedDoc}
                                setActiveDrawer={setActiveDrawer}
                            />
                        ))
                    )}
                </div>
            </div>

            <AnimatePresence>
                {activeDrawer && selectedDoc && (
                    <>
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 z-[60]"
                            onClick={() => setActiveDrawer(null)}
                        />
                        <Motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            ref={drawerRef} role="dialog" aria-modal="true" aria-label="Signature request details"
                            className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-[70] flex flex-col border-l border-slate-200"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {activeDrawer === 'audit' ? 'Audit Trail' : 'Document Details'}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-0.5 truncate max-w-[calc(100vw-100px)] sm:max-w-[300px]">{selectedDoc.name}</p>
                                </div>
                                <button
                                    aria-label="Close signature details" onClick={() => setActiveDrawer(null)}
                                    className="p-2 rounded-full hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {activeDrawer === 'preview' ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedDoc.status === 'completed' && (
                                                <Link
                                                    to={`/signatures/${selectedDoc.id}/view-signed`}
                                                    className="col-span-2 flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-600/10"
                                                >
                                                    <Eye size={18} /> View Signed Document
                                                </Link>
                                            )}
                                            {selectedDoc.pdf_url && (
                                                <a
                                                    href={selectedDoc.pdf_url}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-all"
                                                >
                                                    <FileText size={18} /> Original PDF
                                                </a>
                                            )}
                                            <div className="relative group w-full">
                                                {selectedDoc.final_pdf_url ? (
                                                    <a
                                                        href={selectedDoc.final_pdf_url}
                                                        download
                                                        className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-all shadow-sm hover:shadow"
                                                    >
                                                        <Download size={18} /> Signed PDF
                                                    </a>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl font-medium cursor-not-allowed select-none opacity-60">
                                                        <Download size={18} /> Signed PDF
                                                    </div>
                                                )}

                                                {/* Tooltip for Disabled State - Bottom Position to avoid clipping */}
                                                {!selectedDoc.final_pdf_url && (
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-[200px] hidden group-hover:block transition-all z-50">
                                                        <div className="relative">
                                                            {/* Arrow Pointing Up */}
                                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-slate-800 absolute left-1/2 -translate-x-1/2 -top-[6px]"></div>

                                                            {/* Tooltip Body */}
                                                            <div className="bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl text-center">
                                                                {selectedDoc.status === 'completed'
                                                                    ? "Processing final document..."
                                                                    : "Waiting for all parties to sign."}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Status</span>
                                                <StatusBadge status={selectedDoc.status} />
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

                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <User size={18} className="text-slate-500" />
                                                Signers ({selectedDoc.signers?.length || 0})
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedDoc.signers?.map((signer, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${signer.status === 'signed' ? 'bg-emerald-500' : 'bg-slate-400'
                                                            }`}>
                                                            {signer.name?.charAt(0) || '?'}
                                                        </div>
                                                        <div className="flex-1 min-w-0 break-words">
                                                            <p className="font-semibold text-slate-800 text-sm">{signer.name}</p>
                                                            <p className="text-xs text-slate-400">{signer.email}</p>
                                                        </div>
                                                        {signer.status === 'signed' ? (
                                                            <CheckCircle size={18} className="text-emerald-500" />
                                                        ) : (
                                                            <button
                                                                disabled={actionBusy || !['sent', 'viewed'].includes(selectedDoc.status)}
                                                                onClick={() => handleResendReminder(selectedDoc.id, signer.email)}
                                                                className="text-xs text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-2 py-1 rounded transition-colors"
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
                                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-10">
                                        <div className="relative pl-8">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 ring-4 ring-white" />
                                            <p className="text-xs font-bold text-slate-500 uppercase">Created</p>
                                            <p className="text-sm font-medium text-slate-800 mt-0.5">Document Created</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(selectedDoc.created_at).toLocaleString()}</p>
                                        </div>

                                        {selectedDoc.signers?.map((signer, idx) => (
                                            <div key={idx} className="relative pl-8">
                                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ring-4 ring-white ${signer.status === 'signed' ? 'bg-emerald-500' : 'bg-slate-300'
                                                    }`} />
                                                <p className="text-xs font-bold text-slate-500 uppercase">{signer.status === 'signed' ? 'Signed' : 'Pending'}</p>
                                                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg mt-2">
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
                        </Motion.div>
                    </>
                )}
            </AnimatePresence>
        </DashboardPage>
    );
};

export default SignatureDocumentList;
