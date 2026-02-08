import React, { useState, useRef, useEffect } from 'react';
import {
    Loader2,
    FolderPlus,
    CloudUpload
} from 'lucide-react';
import NodeItem from './components/NodeItem';
import FilePreviewModal from './components/FilePreviewModal';
import ContextMenu from './components/ContextMenu';
import RenameModal from './components/RenameModal';
import CreateFolderModal from './components/CreateFolderModal';
import DriveSidebar from './components/DriveSidebar';
import DriveHeader from './components/DriveHeader';
import useDrive from './hooks/useDrive';
import { toast } from 'react-hot-toast'; // Added toast import

const DriveDashboard = () => {
    const {
        nodes: processedNodes,
        breadcrumbs,
        loading,
        uploading,
        viewMode,
        currentView,
        searchQuery,
        sortBy,
        sortOrder,
        filterType,
        selectedNodes,
        clipboard,
        // Setters
        setViewMode,
        setCurrentView,
        setSearchQuery,
        setSortBy,
        setSortOrder,
        setFilterType,
        // Actions
        onNavigate,
        onFileUpload,
        onCreateFolder,
        onRename,
        onDelete,
        onPaste,
        onMove: onMoveHook, // Renamed to avoid conflict with local handleMove
        onSelect,
        onAddToRecent,
        onToggleFavorite,
        fetchNodes,
        favorites, // Needed for isFavorite check
        onCut: onCutHook,
        onCopy: onCopyHook,
    } = useDrive();

    // Local UI state
    const [previewNode, setPreviewNode] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [renameNode, setRenameNode] = useState(null);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const dragCounter = useRef(0);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.ctrlKey && e.key === 'x' && contextMenu?.node) {
                e.preventDefault();
                onCutHook(contextMenu.node);
            }
            if (e.ctrlKey && e.key === 'c' && contextMenu?.node) {
                e.preventDefault();
                onCopyHook(contextMenu.node);
            }
            if (e.ctrlKey && e.key === 'v' && clipboard) {
                e.preventDefault();
                onPaste(null); // Paste into current folder
            }
            if (e.key === 'Delete' && contextMenu?.node) {
                e.preventDefault();
                onDelete(contextMenu.node);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [contextMenu, clipboard, onCutHook, onCopyHook, onPaste, onDelete]);


    // --- Handlers ---

    const handlePreview = (node) => {
        if (node.type === 'file') {
            setPreviewNode(node);
            onAddToRecent(node);
        }
    };

    const handleContextMenu = (e, node) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            node
        });
    };

    const handleBackgroundContextMenu = (e) => {
        if (e.target.closest('.node-item')) return;
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            node: null,
            isBackground: true
        });
    };

    const handleBackgroundClick = (e) => {
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            onSelect({ id: 'clear' }, { ...e, ctrlKey: false, metaKey: false, shiftKey: false }); // Hacky way to clear
        }
    };

    // --- Enhanced Drag & Drop ---

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Only activate for file uploads, not internal moves
        if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
            if (e.type === "dragenter" || e.type === "dragover") {
                if (e.type === "dragenter") dragCounter.current += 1;
                setDragActive(true);
            } else if (e.type === "dragleave") {
                dragCounter.current -= 1;
                if (dragCounter.current === 0) {
                    setDragActive(false);
                }
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        dragCounter.current = 0;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileUpload(e.dataTransfer.files);
        }
    };

    const handleDownload = (node) => {
        const link = document.createElement('a');
        link.href = `/ api / v1 / drive / nodes / ${node.id}/preview`;
        link.download = node.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started');
    };

    // Determine Title based on View
    const getPageTitle = () => {
        switch (currentView) {
            case 'recent': return 'Recent Files';
            case 'favorites': return 'Favorites';
            case 'trash': return 'Trash';
            default: return 'My Drive';
        }
    };

    return (
        <div
            className="flex h-full bg-slate-50 overflow-hidden relative"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {/* Improved Drag Overlay */}
            {dragActive && (
                <div className="absolute inset-0 z-50 bg-indigo-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-dashed border-indigo-500 transform scale-100 transition-transform">
                        <CloudUpload size={64} className="mx-auto text-indigo-500 mb-4" />
                        <p className="text-2xl font-bold text-slate-800 text-center">Drop files to upload</p>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <DriveSidebar
                currentView={currentView}
                onViewChange={(view) => {
                    setCurrentView(view);
                    // Hook handles parentId reset via side effect if needed, mostly logic is inside hook
                }}
                onUploadClick={() => fileInputRef.current?.click()}
                onCreateFolderClick={() => setShowCreateFolder(true)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full min-w-0 bg-white/50 relative">

                <DriveHeader
                    title={getPageTitle()}
                    breadcrumbs={currentView === 'root' ? breadcrumbs.slice(1) : []}
                    onNavigate={onNavigate}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    filterType={filterType}
                    setFilterType={setFilterType}
                />

                {/* File List */}
                <div
                    className="flex-1 overflow-y-auto p-6 scroll-smooth"
                    ref={dropZoneRef}
                    onContextMenu={handleBackgroundContextMenu}
                    onClick={handleBackgroundClick}
                >
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[60vh]">
                            <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                            <p className="text-slate-400 font-medium">Loading your files...</p>
                        </div>
                    ) : processedNodes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                <FolderPlus size={48} className="text-slate-300" />
                            </div>
                            <p className="text-xl font-bold text-slate-600">
                                {searchQuery ? 'No results found' : 'This folder is empty'}
                            </p>
                            <p className="text-slate-500 mt-2 max-w-xs text-center">
                                {searchQuery
                                    ? `No files match "${searchQuery}"`
                                    : 'Upload files or create a new folder to get started'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-6 text-indigo-600 font-medium hover:underline"
                                >
                                    Upload a file
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6 pb-20"
                            : "flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden pb-20"
                        }>
                            {processedNodes.map(node => (
                                <div key={node.id} className="node-item">
                                    <NodeItem
                                        node={node}
                                        viewMode={viewMode}
                                        onNavigate={onNavigate}
                                        onPreview={handlePreview}
                                        onContextMenu={handleContextMenu}
                                        onDownload={handleDownload}
                                        isSelected={selectedNodes.has(node.id)}
                                        onSelect={onSelect}
                                        onDragStart={() => { }}
                                        onDrop={onMoveHook}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => onFileUpload(e.target.files)}
                className="hidden"
                multiple
            />

            {/* Modals & Overlays */}
            {previewNode && (
                <FilePreviewModal
                    node={previewNode}
                    onClose={() => setPreviewNode(null)}
                />
            )}

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    node={contextMenu.node}
                    isBackground={contextMenu.isBackground}
                    clipboardState={clipboard}
                    onClose={() => setContextMenu(null)}
                    onRename={(node) => setRenameNode(node)}
                    onDownload={handleDownload}
                    onDelete={onDelete}
                    onMove={(node) => {
                        // Mock move or clipboard cut
                        toast('Use Drag & Drop to move', { icon: '💡' });
                    }}
                    onCut={onCutHook}
                    onCopy={onCopyHook}
                    onPaste={onPaste}
                    onCreateFolder={() => setShowCreateFolder(true)}
                    onUpload={() => fileInputRef.current?.click()}
                    onRefresh={() => fetchNodes()}
                    onAddToFavorites={() => contextMenu?.node && onToggleFavorite(contextMenu.node)}
                    isFavorite={contextMenu?.node && favorites.has(contextMenu.node.id)}
                />
            )}

            {renameNode && (
                <RenameModal
                    node={renameNode}
                    onClose={() => setRenameNode(null)}
                    onConfirm={onRename}
                />
            )}

            {showCreateFolder && (
                <CreateFolderModal
                    parentFolder={breadcrumbs[breadcrumbs.length - 1]?.name}
                    onClose={() => setShowCreateFolder(false)}
                    onConfirm={onCreateFolder}
                />
            )}
        </div>
    );
};

export default DriveDashboard;
