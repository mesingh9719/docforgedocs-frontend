import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, Filter, LayoutGrid, List as ListIcon, Trash2, RotateCcw, ChevronLeft, ChevronRight, X, Eye, Download, FileText, User, CheckCircle, Clock, CheckSquare } from 'lucide-react';
import { getDocumentShares } from '../../../api/documents';
import TemplateModal from '../../../components/Dashboard/TemplateModal';
import ShareHistoryModal from '../../../components/ShareHistoryModal';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';
import toast from 'react-hot-toast';
import axios from '../../../api/axios';
import DashboardPage from '../../../components/Dashboard/DashboardPage';

// Sub-components
import DocumentSkeleton from './components/DocumentSkeleton';
import DocumentGridItem from './components/DocumentGridItem';
import DocumentListItem from './components/DocumentListItem';

// Animation Variants (Static)
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
};

const DocumentList = () => {
    const navigate = useNavigate();
    const { can } = usePermissions();

    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('documentViewMode') || 'list');
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState([]);

    // Advanced Features State
    const [trashMode, setTrashMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
    });
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [drawerDoc, setDrawerDoc] = useState(null);

    // Filter States
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        type: 'all',
        category: 'all'
    });

    // Share History Logic
    const [isShareHistoryOpen, setIsShareHistoryOpen] = useState(false);
    const [shareHistory, setShareHistory] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    // Permission checks memoized
    const permissions = React.useMemo(() => ({
        canEdit: can('document.edit'),
        canDelete: can('document.delete'),
        canCreate: can('document.create')
    }), [can]);

    const changeViewMode = useCallback((mode) => {
        setViewMode(mode);
        localStorage.setItem('documentViewMode', mode);
    }, []);

    const fetchDocuments = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            const params = {
                page,
                per_page: pagination.per_page,
                search: filters.search,
                status: filters.status,
                type: filters.type,
                category: filters.category,
                view_mode: trashMode ? 'trash' : 'active'
            };
            const response = await axios.get('/documents', { params });
            setDocuments(response.data.data || []);
            if (response.data.meta) {
                setPagination(prev => ({
                    ...prev,
                    current_page: response.data.meta.current_page,
                    last_page: response.data.meta.last_page,
                    total: response.data.meta.total,
                    from: response.data.meta.from,
                    to: response.data.meta.to
                }));
            }
        } catch (error) {
            console.error("Failed to fetch documents", error);
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, [filters, trashMode, pagination.per_page]); // Kept dependencies minimal

    // Initial Fetch & Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDocuments(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchDocuments]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const getStatusStyle = useCallback((status) => {
        switch (status) {
            case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'signed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    }, []);

    // Handlers wrapped in useCallback for child memoization
    const handleViewHistory = useCallback(async (e, docId) => {
        e.stopPropagation();
        setIsShareHistoryOpen(true);
        setIsHistoryLoading(true);
        try {
            const data = await getDocumentShares(docId);
            setShareHistory(data.data || []);
        } catch (error) {
            console.error("Failed to load history", error);
            toast.error("Could not load history");
        } finally {
            setIsHistoryLoading(false);
        }
    }, []);

    const handleDrawerOpen = useCallback(async (docId, type = 'preview') => {
        try {
            const response = await axios.get(`/documents/${docId}`);
            setDrawerDoc(response.data.data);
            setActiveDrawer(type);
        } catch (error) {
            toast.error("Failed to load document details");
        }
    }, []);

    const handleView = useCallback((doc) => {
        if (doc.signers_count > 0 || (doc.type?.slug === 'general' && doc.signers_count > 0)) {
            handleDrawerOpen(doc.id);
        } else {
            const typeSlug = doc.type?.slug || 'general';
            navigate(`/documents/${typeSlug}/${doc.id}`);
        }
    }, [handleDrawerOpen, navigate]);

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Are you sure you want to move this document to trash?')) return;
        try {
            await axios.delete(`/documents/${id}`);
            toast.success('Document moved to trash', { id: 'doc-delete' });
            fetchDocuments(pagination.current_page);
        } catch (error) {
            toast.error('Failed to delete document', { id: 'doc-delete-error' });
        }
    }, [fetchDocuments, pagination.current_page]);

    const handleRestore = useCallback(async (id) => {
        try {
            await axios.post(`/documents/${id}/restore`);
            toast.success('Document restored', { id: 'doc-restore' });
            fetchDocuments(pagination.current_page);
        } catch (error) {
            toast.error('Failed to restore document', { id: 'doc-restore-error' });
        }
    }, [fetchDocuments, pagination.current_page]);

    const toggleSelect = useCallback((id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedIds.length === documents.length && documents.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(documents.map(d => d.id));
        }
    }, [selectedIds.length, documents]);

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.length} documents?`)) return;
        try {
            await axios.post('/documents/bulk-delete', { ids: selectedIds });
            toast.success(`${selectedIds.length} documents moved to trash`, { id: 'bulk-delete' });
            setSelectedIds([]);
            fetchDocuments(pagination.current_page);
        } catch (error) {
            toast.error('Failed to bulk delete', { id: 'bulk-delete-error' });
        }
    };

    const handleResendReminder = async (docId) => {
        toast.promise(
            axios.post(`/documents/${docId}/remind`, { email: drawerDoc?.signers?.find(s => s.status !== 'signed')?.email }),
            {
                loading: 'Sending reminder...',
                success: 'Reminder sent!',
                error: 'Failed to send reminder'
            }
        );
    };



    return (
        <DashboardPage>
            <DashboardPageHeader
                title="Documents"
                subtitle="Manage, organize, and track your legal documents."
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setTrashMode(prev => !prev);
                            setPagination(p => ({ ...p, current_page: 1 }));
                            setSelectedIds([]);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${trashMode
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {trashMode ? <RotateCcw size={16} /> : <Trash2 size={16} />}
                        {trashMode ? 'Back to All' : 'Trash'}
                    </button>

                    {permissions.canCreate && !trashMode && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 text-sm"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            <span>New Document</span>
                        </button>
                    )}
                </div>
            </DashboardPageHeader>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative flex-1 w-full xl:max-w-lg group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-slate-100 focus:border-slate-300 transition-all placeholder-slate-400 text-slate-900 outline-none"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-center">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="px-3 py-2 bg-slate-50 border-transparent hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer transition-colors w-full sm:w-auto"
                        >
                            <option value="all">All Types</option>
                            <option value="nda">NDA</option>
                            <option value="proposal">Proposal</option>
                            <option value="invoice">Invoice</option>
                        </select>
                    </div>

                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="px-3 py-2 bg-slate-50 border-transparent hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer transition-colors w-full sm:w-auto"
                    >
                        <option value="all">All Categories</option>
                        <option value="generated">Generated Docs</option>
                        <option value="signature">Signature Requests</option>
                    </select>

                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 bg-slate-50 border-transparent hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer transition-colors w-full sm:w-auto"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="signed">Signed</option>
                    </select>

                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => changeViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <ListIcon size={16} />
                        </button>
                        <button
                            onClick={() => changeViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div className="flex items-center gap-4 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2 mb-4">
                    <span className="text-sm font-semibold text-slate-700 ml-2">
                        {selectedIds.length} selected
                    </span>
                    <div className="h-6 w-px bg-slate-300"></div>
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                        <Trash2 size={16} /> Delete Selected
                    </button>
                </div>
            )}

            <div className={`${viewMode === 'list' ? 'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden' : ''}`}>
                {isLoading ? (
                    <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <DocumentSkeleton key={i} viewMode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        key={viewMode}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'overflow-x-auto'}
                    >
                        {viewMode === 'list' ? (
                            <div className="w-full">
                                <div className="hidden md:grid bg-slate-50/50 border-b border-slate-200 px-6 py-3 grid-cols-[auto_3fr_1fr_1fr_1fr_1fr_auto] gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <div className="w-6 flex items-center justify-center">
                                        <button onClick={toggleSelectAll}>
                                            {documents.length > 0 && selectedIds.length === documents.length
                                                ? <CheckSquare size={18} className="text-slate-900" />
                                                : <div className="w-[18px] h-[18px] border-2 border-slate-300 rounded mx-auto" />}
                                        </button>
                                    </div>
                                    <div>Document Name</div>
                                    <div>Type</div>
                                    <div>Status</div>
                                    <div>Updated</div>
                                    <div>Owner</div>
                                    <div className="text-right">Action</div>
                                </div>
                                <div>
                                    {documents.map((doc) => (
                                        <DocumentListItem
                                            key={doc.id}
                                            doc={doc}
                                            getStatusStyle={getStatusStyle}
                                            variants={itemVariants}
                                            onViewHistory={handleViewHistory}
                                            isSelected={selectedIds.includes(doc.id)}
                                            toggleSelect={toggleSelect}
                                            activeMenuId={activeMenuId}
                                            setActiveMenuId={setActiveMenuId}
                                            handleView={handleView}
                                            handleDelete={handleDelete}
                                            handleRestore={handleRestore}
                                            viewMode={trashMode ? 'trash' : 'active'}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <DocumentGridItem
                                    key={doc.id}
                                    doc={doc}
                                    getStatusStyle={getStatusStyle}
                                    variants={itemVariants}
                                    onViewHistory={handleViewHistory}
                                    handleView={handleView}
                                />
                            ))
                        )}
                    </motion.div>
                )}

                {!isLoading && documents.length === 0 && (
                    <div className="text-center py-24 col-span-full flex flex-col items-center justify-center">
                        <div className="p-4 bg-slate-50 rounded-full mb-4 border border-slate-100">
                            <FileText size={40} className="text-slate-300" strokeWidth={1} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No documents found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">
                            {trashMode ? "Trash is empty." : "Create a new document to get started."}
                        </p>
                        {permissions.canCreate && !trashMode && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all text-sm"
                            >
                                <Plus size={16} />
                                <span>Create Document</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {pagination.total > 0 && (
                <div className="border-t border-slate-200 p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm mt-8 rounded-xl border border-t-0">
                    <div className="text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{pagination.from}</span> to <span className="text-slate-900 font-bold">{pagination.to}</span> of <span className="text-slate-900 font-bold">{pagination.total}</span> results
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={pagination.per_page}
                            onChange={(e) => setPagination(p => ({ ...p, per_page: Number(e.target.value), current_page: 1 }))}
                            className="border border-slate-200 rounded-lg text-sm py-1.5 pl-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer font-medium text-slate-600"
                        >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fetchDocuments(pagination.current_page - 1)}
                                disabled={pagination.current_page <= 1}
                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-2 font-bold text-slate-700 min-w-[20px] text-center">
                                {pagination.current_page}
                            </span>
                            <button
                                onClick={() => fetchDocuments(pagination.current_page + 1)}
                                disabled={pagination.current_page >= pagination.last_page}
                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <ShareHistoryModal
                isOpen={isShareHistoryOpen}
                onClose={() => setIsShareHistoryOpen(false)}
                history={shareHistory}
                loading={isHistoryLoading}
            />

            <AnimatePresence>
                {activeDrawer && drawerDoc && (
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
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {activeDrawer === 'audit' ? 'Audit Trail' : 'Document Details'}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-0.5 max-w-[300px] truncate">{drawerDoc.name}</p>
                                </div>
                                <button
                                    onClick={() => setActiveDrawer(null)}
                                    className="p-2 rounded-full hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {activeDrawer === 'preview' ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-3">
                                            {drawerDoc.status === 'completed' && (
                                                <button
                                                    onClick={() => navigate(`/signatures/${drawerDoc.id}/view-signed`)}
                                                    className="col-span-2 flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-600/10"
                                                >
                                                    <Eye size={18} /> View Signed Document
                                                </button>
                                            )}
                                            {drawerDoc.pdf_url && (
                                                <a
                                                    href={drawerDoc.pdf_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-all"
                                                >
                                                    <FileText size={18} /> Original PDF
                                                </a>
                                            )}
                                            {drawerDoc.final_pdf_url && (
                                                <a
                                                    href={drawerDoc.final_pdf_url}
                                                    download
                                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-all"
                                                >
                                                    <Download size={18} /> Signed PDF
                                                </a>
                                            )}
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Status</span>
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700`}>
                                                    {drawerDoc.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Created On</span>
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {new Date(drawerDoc.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Last Activity</span>
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {new Date(drawerDoc.updated_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Signers List */}
                                        {drawerDoc.signers && drawerDoc.signers.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <User size={18} className="text-slate-500" />
                                                    Signers ({drawerDoc.signers.length})
                                                </h4>
                                                <div className="space-y-3">
                                                    {drawerDoc.signers.map((signer, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${signer.status === 'signed' ? 'bg-emerald-500' : 'bg-slate-400'
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
                                                                    onClick={() => handleResendReminder(drawerDoc.id)}
                                                                    className="text-xs text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-2 py-1 rounded transition-colors"
                                                                >
                                                                    Resend
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        <Clock size={40} className="mx-auto mb-4 text-slate-300" />
                                        <p>Audit Trail details not fully loaded.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </DashboardPage>
    );
};

export default DocumentList;