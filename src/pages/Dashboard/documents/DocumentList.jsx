import StatusBadge from '../../../components/ui/StatusBadge';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Plus, Search, Filter, LayoutGrid, List as ListIcon, Trash2, RotateCcw, ChevronLeft, ChevronRight, X, Eye, Download, FileText, User, CheckCircle, Clock, CheckSquare } from 'lucide-react';
import { getDocumentShares, duplicateDocument, exportDocuments } from '../../../api/documents';
import TemplateModal from '../../../components/Dashboard/TemplateModal';
import ShareHistoryModal from '../../../components/ShareHistoryModal';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';
import toast from 'react-hot-toast';
import axios from '../../../api/axios';
import DashboardPage from '../../../components/Dashboard/DashboardPage';
import './documents.css';

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
    const [loadError, setLoadError] = useState(false);
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
    const drawerRef = useRef(null);
    useEffect(() => {
        if (!activeDrawer) return;
        const previousFocus = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        drawerRef.current?.querySelector('button')?.focus();
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setActiveDrawer(null);
            if (event.key !== 'Tab') return;
            const controls = drawerRef.current?.querySelectorAll('button:not(:disabled), a[href], input, select');
            if (!controls?.length) return;
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = overflow;
            document.removeEventListener('keydown', onKeyDown);
            previousFocus?.focus();
        };
    }, [activeDrawer]);

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
        canCreate: can('document.create'),
        canSign: can('document.sign')
    }), [can]);

    const changeViewMode = useCallback((mode) => {
        setViewMode(mode);
        localStorage.setItem('documentViewMode', mode);
    }, []);

    const fetchDocuments = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            setLoadError(false);
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
            setLoadError(true);
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
        setSelectedIds([]);
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
        } catch {
            toast.error("Failed to load document details");
        }
    }, []);

    const handleSign = useCallback((doc) => {
        navigate(`/signatures/${doc.id}/edit`);
    }, [navigate]);

    const handleView = useCallback((doc) => {
        const typeSlug = doc.document_type?.slug || doc.type?.slug || 'general';
        const hasBlocks = doc.content && doc.content.blocks && doc.content.blocks.length > 0;

        // 1. Standard Documents (NDA, Proposal, Invoice, or any doc with content blocks) -> Editor
        // We explicitly check types to ensure even empty drafts go to the editor
        if (['nda', 'proposal', 'invoice'].includes(typeSlug) || hasBlocks) {
            navigate(`/documents/${typeSlug}/${doc.id}`);
            return;
        }

        // 2. Uploaded Signature Requests (General type + PDF + No content) -> Drawer
        // If it has a PDF but no blocks, and isn't a known standard type, it's an uploaded doc.
        if (doc.pdf_url) {
            handleDrawerOpen(doc.id);
            return;
        }

        // 3. Fallback (New/Empty General Docs) -> Editor
        navigate(`/documents/${typeSlug}/${doc.id}`);
    }, [handleDrawerOpen, navigate]);

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Are you sure you want to move this document to trash?')) return;
        try {
            await axios.delete(`/documents/${id}`);
            toast.success('Document moved to trash', { id: 'doc-delete' });
            fetchDocuments(pagination.current_page);
        } catch {
            toast.error('Failed to delete document', { id: 'doc-delete-error' });
        }
    }, [fetchDocuments, pagination.current_page]);

    const handleRestore = useCallback(async (id) => {
        try {
            await axios.post(`/documents/${id}/restore`);
            toast.success('Document restored', { id: 'doc-restore' });
            fetchDocuments(pagination.current_page);
        } catch {
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
        } catch {
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
    const handleDuplicate = async (doc) => {
        try {
            await duplicateDocument(doc.id);
            toast.success(`Duplicated "${doc.name}"`);
            fetchDocuments(pagination.current_page);
            setActiveMenuId(null);
        } catch {
            toast.error('Failed to duplicate document');
        }
    };

    const handleExport = async () => {
        try {
            toast.loading('Exporting documents...', { id: 'export' });
            const response = await exportDocuments({
                search: filters.search,
                status: filters.status,
                type: filters.type,
                category: filters.category
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `documents_export_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Export complete', { id: 'export' });
        } catch (error) {
            console.error(error);
            toast.error('Failed to export', { id: 'export' });
        }
    };


    return (
        <DashboardPage className="documents-module">
            <DashboardPageHeader
                title={trashMode ? "Document trash" : "Documents"}
                subtitle={trashMode ? "Review deleted documents and restore the ones you need." : "Create, organize, and keep track of your workspace documents."}
            >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all bg-white"
                        title="Export filtered list to CSV"
                        aria-label="Export filtered list to CSV"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>

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
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all  text-sm"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            <span>New Document</span>
                        </button>
                    )}
                </div>
            </DashboardPageHeader>

            <div className="documents-toolbar">
                <div className="documents-search relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        aria-label="Search documents"
                        placeholder="Search by document name…"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-slate-100 focus:border-slate-300 transition-all placeholder-slate-400 text-slate-900 outline-none"
                    />
                </div>

                <div className="documents-filters">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            aria-label="Document type"
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="px-3 py-2 bg-slate-50 border-transparent hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer transition-colors w-full sm:w-auto"
                        >
                            <option value="all">All Types</option>
                            <option value="nda">NDA</option>
                            <option value="proposal">Proposal</option>
                            <option value="invoice">Invoice</option>
                            <option value="offer-letter">Offer Letter</option>
                            <option value="consulting-agreement">Consulting Agreement</option>
                        </select>
                    </div>

                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

                    <select
                        aria-label="Document category"
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
                        aria-label="Document status"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 bg-slate-50 border-transparent hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer transition-colors w-full sm:w-auto"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="signed">Signed</option>
                        <option value="completed">Completed</option>
                    </select>

                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            aria-label="List view" aria-pressed={viewMode === 'list'}
                            onClick={() => changeViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <ListIcon size={16} />
                        </button>
                        <button
                            aria-label="Grid view" aria-pressed={viewMode === 'grid'}
                            onClick={() => changeViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>

                    {(filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.status !== 'all') && (
                        <button
                            type="button"
                            onClick={() => {
                                setFilters({ search: '', status: 'all', type: 'all', category: 'all' });
                                setSelectedIds([]);
                            }}
                            className="self-start sm:self-auto px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            <div className="documents-results" role="status" aria-live="polite">
                <div><span className="font-semibold text-slate-800">{isLoading ? 'Loading documents…' : loadError ? 'Documents unavailable' : `${pagination.total.toLocaleString()} ${pagination.total === 1 ? 'document' : 'documents'}`}</span><span className="text-slate-500">{trashMode ? ' in trash' : ' in your library'}{Object.values(filters).some(value => value && value !== 'all') ? ' · Filtered results' : ''}</span></div>
                <span className="text-slate-500 hidden sm:block">{viewMode === 'list' ? 'List view' : 'Grid view'}</span>
            </div>

            {selectedIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 w-full bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-4">
                    <span className="text-sm font-semibold text-slate-700 ml-2">
                        {selectedIds.length} selected
                    </span>
                    <button className="text-sm text-indigo-700 hover:underline" onClick={() => setSelectedIds([])}>Clear selection</button>
                    <div className="h-6 w-px bg-slate-300"></div>
                    {permissions.canDelete && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                        >
                            <Trash2 size={16} /> Delete Selected
                        </button>
                    )}
                </div>
            )}

            <div className={`${viewMode === 'list' ? 'bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible' : ''}`}>
                {isLoading ? (
                    <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <DocumentSkeleton key={i} viewMode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <Motion.div
                        key={viewMode}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'overflow-visible'}
                    >
                        {viewMode === 'list' ? (
                            <div className="w-full">
                                <div className="documents-table-header hidden xl:grid bg-slate-50/50 border-b border-slate-200 px-6 py-3 grid-cols-[24px_minmax(0,2.5fr)_minmax(0,1fr)_90px_100px_minmax(0,1fr)_72px] gap-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    <div className="w-6 flex items-center justify-center">
                                        <button aria-label="Select all documents on this page" aria-pressed={documents.length > 0 && selectedIds.length === documents.length} onClick={toggleSelectAll}>
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
                                            variants={itemVariants}
                                            onViewHistory={handleViewHistory}
                                            isSelected={selectedIds.includes(doc.id)}
                                            toggleSelect={toggleSelect}
                                            activeMenuId={activeMenuId}
                                            setActiveMenuId={setActiveMenuId}
                                            handleView={handleView}
                                            handleDelete={handleDelete}
                                            handleRestore={handleRestore}
                                            handleDuplicate={handleDuplicate}
                                            handleSign={handleSign}
                                            viewMode={trashMode ? 'trash' : 'active'}
                                            permissions={permissions}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <DocumentGridItem
                                    key={doc.id}
                                    doc={doc}
                                    variants={itemVariants}
                                    onViewHistory={handleViewHistory}
                                    handleView={handleView}
                                />
                            ))
                        )}
                    </Motion.div>
                )}

                {!isLoading && loadError && (
                    <div className="text-center py-24 col-span-full flex flex-col items-center justify-center">
                        <div className="p-4 bg-red-50 rounded-full mb-4 border border-red-100">
                            <FileText size={40} className="text-red-300" strokeWidth={1} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Could not load documents</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">Check your connection and try again.</p>
                        <button onClick={() => fetchDocuments(1)} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all text-sm">
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !loadError && documents.length === 0 && (
                    <div className="text-center py-24 col-span-full flex flex-col items-center justify-center">
                        <div className="p-4 bg-slate-50 rounded-full mb-4 border border-slate-100">
                            <FileText size={40} className="text-slate-300" strokeWidth={1} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No documents found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">
                            {trashMode ? "Trash is empty." : Object.values(filters).some(value => value && value !== 'all') ? "Try another search or clear your filters to see more documents." : "Create a new document to get started."}
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

            {!loadError && !isLoading && pagination.total > 0 && (
                <div className="border-t border-slate-200 p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm mt-8 rounded-xl border border-t-0">
                    <div className="text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{pagination.from}</span> to <span className="text-slate-900 font-bold">{pagination.to}</span> of <span className="text-slate-900 font-bold">{pagination.total}</span> results
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            aria-label="Documents per page"
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
                                aria-label="Previous page"
                                onClick={() => { setSelectedIds([]); fetchDocuments(pagination.current_page - 1); }}
                                disabled={pagination.current_page <= 1}
                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-2 font-bold text-slate-700 min-w-[20px] text-center">
                                {pagination.current_page}
                            </span>
                            <button
                                aria-label="Next page"
                                onClick={() => { setSelectedIds([]); fetchDocuments(pagination.current_page + 1); }}
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
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 z-[60]"
                            aria-label="Close document preview" onClick={() => setActiveDrawer(null)}
                        />
                        <Motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            ref={drawerRef} role="dialog" aria-modal="true" aria-label="Document details"
                            className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-[70] flex flex-col border-l border-slate-200"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {activeDrawer === 'audit' ? 'Audit Trail' : 'Document Details'}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-0.5 max-w-[calc(100vw-100px)] sm:max-w-[300px] truncate">{drawerDoc.name}</p>
                                </div>
                                <button
                                    aria-label="Close document preview" onClick={() => setActiveDrawer(null)}
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
                                            {drawerDoc.status?.toLowerCase() === 'draft' &&
                                                drawerDoc.pdf_url &&
                                                (!drawerDoc.content?.blocks?.length) &&
                                                (!drawerDoc.signers?.some(s => ['sent', 'viewed', 'signed'].includes(s.status))) && (
                                                    <button
                                                        onClick={() => navigate(`/signatures/${drawerDoc.id}/edit`)}
                                                        className="col-span-2 flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-600/10"
                                                    >
                                                        <FileText size={18} /> Prepare For Signing
                                                    </button>
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
                                                <StatusBadge status={drawerDoc.status} />
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
                        </Motion.div>
                    </>
                )}
            </AnimatePresence>
        </DashboardPage>
    );
};

export default DocumentList;
