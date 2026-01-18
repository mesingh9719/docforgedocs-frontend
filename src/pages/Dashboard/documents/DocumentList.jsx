import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, MoreVertical, Search, Filter, LayoutGrid, List as ListIcon, Clock, User, ArrowUpRight } from 'lucide-react';
import { getDocuments } from '../../../api/documents';
import TemplateModal from '../../../components/Dashboard/TemplateModal';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';

// Flat Skeleton Component
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

const DocumentList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [isLoading, setIsLoading] = useState(true);

    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();
    const { can } = usePermissions();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            const data = await getDocuments();
            setDocuments(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const getStatusStyle = (status) => {
        switch (status) {
            case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'Sent': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Signed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-[calc(100vh-140px)] space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents</h1>
                    <p className="text-slate-500 mt-1 text-sm">Manage, organize, and track your legal documents.</p>
                </div>
                {can('document.create') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        <span>New Document</span>
                    </button>
                )}
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, type, or client..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-slate-200 rounded-md text-sm focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400 text-slate-900 border"
                    />
                </div>
                <div className="w-px h-6 bg-slate-200 hidden lg:block"></div>
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
                    <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-md transition-colors text-sm font-medium border border-transparent hover:border-slate-200">
                        <Filter size={16} strokeWidth={2} />
                        <span>Filter</span>
                    </button>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <ListIcon size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
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
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'divide-y divide-slate-100'}
                    >
                        {/* List Header (Only for List View) */}
                        {viewMode === 'list' && (
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <div>Document Name</div>
                                <div>Type</div>
                                <div>Status</div>
                                <div>Updated</div>
                                <div>Owner</div>
                                <div className="text-right">Action</div>
                            </div>
                        )}

                        {documents.map((doc) => (
                            viewMode === 'list' ? (
                                // LIST ITEM
                                <motion.div
                                    key={doc.id}
                                    variants={itemVariants}
                                    className="px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-6 items-center hover:bg-slate-50 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-indigo-600"
                                    onClick={() => navigate(`/documents/${doc.type}/${doc.id}`)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <FileText size={18} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-900 block text-sm group-hover:text-indigo-600 transition-colors">{doc.name}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-slate-500">{doc.type}</div>
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
                                    <div className="text-right">
                                        {(can('document.edit') || can('document.delete')) && (
                                            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-indigo-600 transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                // GRID CARD
                                <motion.div
                                    key={doc.id}
                                    variants={itemVariants}
                                    className="bg-white rounded-lg border border-slate-200 p-5 cursor-pointer shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between h-full"
                                    onClick={() => navigate(`/documents/${doc.type}/${doc.id}`)}
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <FileText size={20} strokeWidth={2} />
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusStyle(doc.status)}`}>
                                                    {doc.status}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-base text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{doc.name}</h3>
                                        <p className="text-xs font-medium text-slate-400 mb-4 uppercase tracking-wider">{doc.type}</p>
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
                            )
                        ))}
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
                        {can('document.create') && (
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
        </div>
    );
};

export default DocumentList;