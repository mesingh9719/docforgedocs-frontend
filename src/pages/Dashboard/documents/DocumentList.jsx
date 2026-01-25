import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, MoreVertical, Search, Filter, LayoutGrid, List as ListIcon, Clock, User, ArrowUpRight } from 'lucide-react';
import { getDocuments, getDocumentShares } from '../../../api/documents';
import TemplateModal from '../../../components/Dashboard/TemplateModal';
import ShareHistoryModal from '../../../components/ShareHistoryModal';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';
import toast from 'react-hot-toast';

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
                <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 border border-indigo-200">
                    ME
                </div>
                <span className="text-xs font-medium text-slate-500">You</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Clock size={10} /> {new Date(doc.updated_at).toLocaleDateString()}
            </span>
        </div>
    </motion.div>
);

const DocumentListItem = ({ doc, navigate, getStatusStyle, variants, permissions, onViewHistory }) => (
    <motion.div
        variants={variants}
        className="min-w-[800px] px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-6 items-center hover:bg-slate-50 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-indigo-600 border-b border-slate-50 last:border-b-0"
        onClick={() => navigate(`/documents/${doc.type?.slug || doc.type}/${doc.id}`)}
    >
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText size={18} strokeWidth={2} />
            </div>
            <div>
                <span className="font-semibold text-slate-900 block text-sm group-hover:text-indigo-600 transition-colors">{doc.title || doc.name}</span>
            </div>
        </div>
        <div className="text-sm font-medium text-slate-500 capitalize">{doc.type?.name || doc.type}</div>
        <div>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusStyle(doc.status)}`}>
                {doc.status}
            </span>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Clock size={12} className="text-slate-400" /> {new Date(doc.updated_at).toLocaleDateString()}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                ME
            </div>
            <span>You</span>
        </div>
        <div className="text-right flex items-center justify-end gap-2">
            <button
                onClick={(e) => onViewHistory(e, doc.id)}
                className="p-1.5 hover:bg-indigo-50 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                title="View Share History"
            >
                <Mail size={16} />
            </button>
            {(permissions.canEdit || permissions.canDelete) && (
                <button className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-indigo-600 transition-colors">
                    <MoreVertical size={16} />
                </button>
            )}
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
    const fetchDocuments = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = {
                search: filters.search,
                status: filters.status,
                type: filters.type
            };
            const data = await getDocuments(params);
            setDocuments(data.data || []);
        } catch (error) {
            console.error("Failed to fetch documents", error);
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

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
            // setShareHistory([]); // Optional: clear on error or show toast
        } finally {
            setIsHistoryLoading(false);
        }
    };

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDocuments();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchDocuments]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'signed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
                {permissions.canCreate && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 text-sm"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        <span>New Document</span>
                    </button>
                )}
            </DashboardPageHeader>

            {/* Controls Bar */}
            <div className="flex flex-col xl:flex-row gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm items-stretch xl:items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search by name..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-slate-200 rounded-md text-sm focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400 text-slate-900 border"
                    />
                </div>
                <div className="h-px w-full xl:w-px xl:h-6 bg-slate-200 hidden md:block"></div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-auto"
                    >
                        <option value="all">All Types</option>
                        <option value="nda">NDA</option>
                        <option value="proposal">Proposal</option>
                        <option value="invoice">Invoice</option>
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-auto"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="signed">Signed</option>
                    </select>
                </div>

                <div className="h-px w-full xl:w-px xl:h-6 bg-slate-200 hidden md:block"></div>

                <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 ml-auto xl:ml-0">
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
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No documents created yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm leading-relaxed">
                            Start by creating your first document using one of our templates.
                        </p>
                        {permissions.canCreate && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-5 py-2 bg-indigo-600 border border-transparent text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                            >
                                Create Document
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Template Selection Modal */}
            <TemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Share History Modal */}
            <ShareHistoryModal
                isOpen={isShareHistoryOpen}
                onClose={() => setIsShareHistoryOpen(false)}
                history={shareHistory}
                loading={isHistoryLoading}
            />
        </div>
    );
};

export default DocumentList;