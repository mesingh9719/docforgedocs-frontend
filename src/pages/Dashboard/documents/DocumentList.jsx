import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, MoreVertical, Search, Filter, LayoutGrid, List as ListIcon, Clock, User, ArrowUpRight, CheckSquare, Square, Trash2, RotateCcw, Eye, ChevronLeft, ChevronRight, X, CheckCircle, Download, Archive, RefreshCw } from 'lucide-react';
import { getDocuments, getDocumentShares, getDocument } from '../../../api/documents';
import TemplateModal from '../../../components/Dashboard/TemplateModal';
import ShareHistoryModal from '../../../components/ShareHistoryModal';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';
import toast from 'react-hot-toast';
import axios from '../../../api/axios';
import { formatDistanceToNow } from 'date-fns';

// --- Sub-Components for cleaner rendering ---

const DocumentSkeleton = ({ viewMode }) => (
    <div className={`animate-pulse ${viewMode === 'list' ? 'flex items-center gap-6 py-4 px-6 border-b border-slate-100 last:border-0' : 'bg-white border border-slate-200 rounded-lg p-6'}`}>
        <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/3"></div>
            <div className="h-3 bg-slate-50 rounded w-1/4"></div>
        </div>
        {viewMode === 'list' && (
            <>
                <div className="hidden md:block w-24 h-4 bg-slate-100 rounded"></div>
                <div className="hidden md:block w-32 h-4 bg-slate-100 rounded"></div>
            </>
        )}
    </div>
);

const DocumentGridItem = ({ doc, navigate, getStatusStyle, variants, onViewHistory }) => (
    <motion.div
        variants={variants}
        className="bg-white rounded-lg border border-slate-200 p-5 cursor-pointer shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between h-full"
        onClick={() => navigate(`/documents/${doc.type?.slug || doc.type}/${doc.id}`)}
    >
        <div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText size={20} strokeWidth={2} />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => onViewHistory(e, doc.id)}
                        className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center gap-1"
                        title="View Share History"
                    >
                        <Mail size={12} /> History
                    </button>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusStyle(doc.status)}`}>
                        {doc.status}
                    </span>
                </div>
            </div>

            <h3 className="font-bold text-base text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{doc.title || doc.name}</h3>
            <p className="text-xs font-medium text-slate-400 mb-4 uppercase tracking-wider">{doc.type?.name || doc.type}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
            <div className="flex items-center gap-2">
                {doc.creator?.avatar_url ? (
                    <img
                        src={doc.creator.avatar_url}
                        alt={doc.creator.name}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200"
                    />
                ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white border border-transparent shadow-sm">
                        {doc.creator?.name ? doc.creator.name.substring(0, 2).toUpperCase() : 'NA'}
                    </div>
                )}
                <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]" title={doc.creator?.name}>
                    {doc.creator?.name || 'Unknown'}
                </span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Clock size={10} /> {new Date(doc.updated_at).toLocaleDateString()}
            </span>
        </div>
    </motion.div>
);

const DocumentListItem = ({ doc, navigate, getStatusStyle, variants, permissions, onViewHistory, isSelected, toggleSelect, showCheckbox, activeMenuId, setActiveMenuId, handleView, handleDelete, handleRestore, viewMode }) => (
    <motion.div
        variants={variants}
        className={`px-6 py-3 grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_auto] gap-6 items-center hover:bg-slate-50 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-indigo-600 border-b border-slate-50 last:border-b-0 ${isSelected ? 'bg-indigo-50/30' : ''}`}
        onClick={() => navigate(`/documents/${doc.type?.slug || doc.type}/${doc.id}`)}
    >
        {/* Checkbox */}
        <div onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }}>
            {isSelected ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} className="text-slate-300 group-hover:text-slate-400" />}
        </div>

        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                <FileText size={18} strokeWidth={2} />
            </div>
            <div>
                <span className={`font-semibold block text-sm transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-900 group-hover:text-indigo-600'}`}>{doc.title || doc.name}</span>
            </div>
        </div>
        <div className="text-sm font-medium text-slate-500 capitalize">{doc.type?.name || doc.type}</div>
        <div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(doc.status)}`}>
                {doc.status}
            </span>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Clock size={12} className="text-slate-400" /> {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
            {doc.creator?.avatar_url ? (
                <img
                    src={doc.creator.avatar_url}
                    alt={doc.creator.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-sm"
                />
            ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white border border-transparent shadow-sm">
                    {doc.creator?.name ? doc.creator.name.substring(0, 2).toUpperCase() : 'NA'}
                </div>
            )}
            <span className="font-medium text-slate-700">{doc.creator?.name || 'Unknown'}</span>
        </div>
        <div className="text-right flex items-center justify-end gap-2 relative">
            <button
                onClick={(e) => onViewHistory(e, doc.id)}
                className="p-1.5 hover:bg-indigo-50 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                title="View Share History"
            >
                <Mail size={16} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                }}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-indigo-600 transition-colors"
            >
                <MoreVertical size={16} />
            </button>
            {/* Context Menu */}
            <AnimatePresence>
                {activeMenuId === doc.id && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 0, x: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-8 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 p-1.5 flex flex-col gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {viewMode === 'active' ? (
                            <>
                                <button
                                    onClick={() => {
                                        navigate(`/documents/${doc.type?.slug || doc.type}/${doc.id}`);
                                        setActiveMenuId(null);
                                    }}
                                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                                >
                                    <Eye size={16} /> View/Edit
                                </button>
                                <button onClick={() => { handleDelete(doc.id); setActiveMenuId(null); }} className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { handleRestore(doc.id); setActiveMenuId(null); }} className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <RotateCcw size={16} /> Restore
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </motion.div>
);

// --- Main Component ---

const DocumentList = () => {
    const navigate = useNavigate();
    const { can } = usePermissions();

    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('documentViewMode') || 'list');
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState([]);

    // Advanced Features State
    const [trashMode, setTrashMode] = useState(false); // Toggle between Active and Trash
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
        type: 'all'
    });

    // Permission checks memoized
    const permissions = {
        canEdit: can('document.edit'),
        canDelete: can('document.delete'),
        canCreate: can('document.create')
    };

    // Update view mode and persist
    const changeViewMode = (mode) => {
        setViewMode(mode);
        localStorage.setItem('documentViewMode', mode);
    };

    // Fetch Documents Logic
    const fetchDocuments = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            const params = {
                page,
                per_page: pagination.per_page,
                search: filters.search,
                status: filters.status,
                type: filters.type,
                view_mode: trashMode ? 'trash' : 'active'
            };
            const response = await axios.get('/documents', { params });
            // API returns Resource Collection: { data: [...], meta: { ... }, links: { ... } }
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
    }, [filters, trashMode, pagination.per_page]);

    // Share History Logic
    const [isShareHistoryOpen, setIsShareHistoryOpen] = useState(false);
    const [shareHistory, setShareHistory] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    const handleViewHistory = async (e, docId) => {
        e.stopPropagation();
        setIsShareHistoryOpen(true);
        setIsHistoryLoading(true);
        try {
            const data = await getDocumentShares(docId);
            setShareHistory(data.data || []);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    // Debounced Search Effect
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

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'signed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const handleDrawerOpen = async (docId, type = 'preview') => {
        try {
            // Optimistic set if we have the doc (but list doc doesn't have signers)
            // safer to fetch.
            const response = await axios.get(`/documents/${docId}`);
            setDrawerDoc(response.data.data);
            setActiveDrawer(type);
        } catch (error) {
            toast.error("Failed to load document details");
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

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.length === documents.length && documents.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(documents.map(d => d.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // Actions
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to move this document to trash?')) return;
        try {
            await axios.delete(`/documents/${id}`);
            toast.success('Document moved to trash');
            fetchDocuments(pagination.current_page);
        } catch (error) {
            toast.error('Failed to delete document');
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.length} documents?`)) return;
        try {
            await axios.post('/documents/bulk-delete', { ids: selectedIds });
            toast.success(`${selectedIds.length} documents moved to trash`);
            setSelectedIds([]);
            fetchDocuments(pagination.current_page);
        } catch (error) {
            toast.error('Failed to bulk delete');
        }
    };

    const handleRestore = async (id) => {
        try {
            await axios.post(`/documents/${id}/restore`);
            toast.success('Document restored');
            fetchDocuments(pagination.current_page);
        } catch (error) {
            toast.error('Failed to restore document');
        }
    };

    const handleView = (doc) => {
        if (doc.signers_count > 0 || (doc.type && doc.type.slug === 'general' && doc.signers_count > 0)) {
            handleDrawerOpen(doc.id);
        } else {
            navigate(`/documents/${doc.document_type?.slug || doc.type || 'general'}/${doc.id}`);
        }
    };


    // Animation Variants
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



    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <DashboardPageHeader
                title="Documents"
                subtitle="Manage, organize, and track your legal documents."
            >
                <div className="flex items-center gap-3">
                    {/* Trash Toggle */}
                    <button
                        onClick={() => {
                            setTrashMode(prev => !prev);
                            setPagination(p => ({ ...p, current_page: 1 }));
                            setSelectedIds([]);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${trashMode
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {trashMode ? <RotateCcw size={16} /> : <Trash2 size={16} />}
                        {trashMode ? 'Back to All' : 'Trash'}
                    </button>

                    {permissions.canCreate && !trashMode && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 text-sm"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            <span>New Document</span>
                        </button>
                    )}
                </div>
            </DashboardPageHeader>

            {/* Controls Bar - Styled to match Team.jsx Search Bar */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 w-full xl:max-w-lg group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search documents by name..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder-slate-400 text-slate-900 outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-center">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="px-3 py-2 bg-slate-50 border-transparent hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-colors w-full sm:w-auto"
                        >
                            <option value="all">All Types</option>
                            <option value="nda">NDA</option>
                            <option value="proposal">Proposal</option>
                            <option value="invoice">Invoice</option>
                        </select>
                    </div>

                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 bg-slate-50 border-transparent hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-colors w-full sm:w-auto"
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
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <ListIcon size={16} />
                        </button>
                        <button
                            onClick={() => changeViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Actions (if selected) */}
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-4 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-semibold text-slate-700 ml-2">
                        {selectedIds.length} selected
                    </span>
                    <div className="h-6 w-px bg-slate-300"></div>
                    {/* Assuming 'active' view for bulk delete, adjust if trash view is added */}
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                        <Trash2 size={16} /> Delete Selected
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className={`${viewMode === 'list' ? 'bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden' : ''}`}>
                {isLoading ? (
                    <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-0'}`}>
                        {[1, 2, 3, 4, 5].map((i) => (
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
                            // LIST VIEW
                            <div className="min-w-[800px]">
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_auto] gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <div className="w-6">
                                        <button onClick={toggleSelectAll}>
                                            {documents.length > 0 && selectedIds.length === documents.length ? <CheckSquare size={18} className="text-slate-900" /> : <Square size={18} />}
                                        </button>
                                    </div>
                                    <div>Document Name</div>
                                    <div>Type</div>
                                    <div>Status</div>
                                    <div>Updated</div>
                                    <div>Owner</div>
                                    <div className="text-right">Action</div>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {documents.map((doc) => (
                                        <DocumentListItem
                                            key={doc.id}
                                            doc={doc}
                                            navigate={navigate}
                                            getStatusStyle={getStatusStyle}
                                            variants={itemVariants}
                                            permissions={permissions}
                                            onViewHistory={handleViewHistory}
                                            isSelected={selectedIds.includes(doc.id)}
                                            toggleSelect={toggleSelect}
                                            showCheckbox={true}
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
                            // GRID VIEW
                            documents.map((doc) => (
                                <DocumentGridItem
                                    key={doc.id}
                                    doc={doc}
                                    navigate={navigate}
                                    getStatusStyle={getStatusStyle}
                                    variants={itemVariants}
                                    onViewHistory={handleViewHistory}
                                />
                            ))
                        )}
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && documents.length === 0 && (
                    <div className="text-center py-20 col-span-full flex flex-col items-center justify-center">
                        <div className="p-4 bg-slate-50 rounded-full mb-4 ring-1 ring-slate-100">
                            <FileText size={32} className="text-slate-300" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No documents found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm leading-relaxed">
                            {trashMode ? "Trash is empty." : "Start by creating your first document."}
                        </p>
                    </div>
                )}
            </div>
            {/* Pagination Footer */}
            {pagination.total > 0 && (
                <div className="border-t border-slate-200 p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm mt-auto rounded-b-xl">
                    <div className="text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{pagination.from}</span> to <span className="text-slate-900 font-bold">{pagination.to}</span> of <span className="text-slate-900 font-bold">{pagination.total}</span> results
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Page Size */}
                        <select
                            value={pagination.per_page}
                            onChange={(e) => setPagination(p => ({ ...p, per_page: Number(e.target.value), current_page: 1 }))}
                            className="border border-slate-200 rounded-lg text-sm py-1.5 pl-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer font-medium text-slate-600"
                        >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>

                        {/* Nav Buttons */}
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


            {/* Template Selection Modal */}
            <TemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Share History Modal */}
            <ShareHistoryModal
                isOpen={isShareHistoryOpen}
                onClose={() => setIsShareHistoryOpen(false)}
                history={shareHistory}
                loading={isHistoryLoading}
            />

            {/* Side Drawer (Shared for Audit & Preview) */}
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
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {activeDrawer === 'audit' ? 'Audit Trail' : 'Document Details'}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-0.5">{drawerDoc.name}</p>
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
                                            {drawerDoc.status === 'completed' && (
                                                <button
                                                    onClick={() => navigate(`/signatures/${drawerDoc.id}/view-signed`)}
                                                    className="col-span-2 flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-200"
                                                >
                                                    <Eye size={18} /> View Signed Document
                                                </button>
                                            )}
                                            {drawerDoc.pdf_url && (
                                                <a
                                                    href={drawerDoc.pdf_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 rounded-xl font-medium transition-all"
                                                >
                                                    <FileText size={18} /> Original PDF
                                                </a>
                                            )}
                                            {drawerDoc.final_pdf_url && (
                                                <a
                                                    href={drawerDoc.final_pdf_url}
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
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${drawerDoc.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                                                    }`}>
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
                                                    <User size={18} className="text-indigo-600" />
                                                    Signers ({drawerDoc.signers.length})
                                                </h4>
                                                <div className="space-y-3">
                                                    {drawerDoc.signers.map((signer, idx) => (
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
                                                                    onClick={() => handleResendReminder(drawerDoc.id)}
                                                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded transition-colors"
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
                                    // Audit Log Content (Placeholder or limited for now if audit logs not loaded)
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
        </div>
    );
};

export default DocumentList;