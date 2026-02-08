import React from 'react';
import {
    Folder,
    FileText,
    Image as ImageIcon,
    File,
    Download,
    MoreVertical,
    Star,
} from 'lucide-react';
import { formatBytes } from '../utils';

const NodeItem = ({
    node,
    viewMode,
    onNavigate,
    onPreview,
    onContextMenu,
    onDownload,
    isSelected,
    onSelect,
    onDragStart,
    onDrop
}) => {
    const getFileIcon = () => {
        if (node.type === 'folder') {
            return <Folder className="text-indigo-500 fill-indigo-500/20" size={viewMode === 'grid' ? 56 : 24} strokeWidth={1.5} />;
        }

        const mime = node.mime_type || '';

        if (mime.startsWith('image/')) {
            return <ImageIcon className="text-purple-500" size={viewMode === 'grid' ? 56 : 24} strokeWidth={1.5} />;
        }
        if (mime === 'application/pdf' || mime.includes('document')) {
            return <FileText className="text-red-500" size={viewMode === 'grid' ? 56 : 24} strokeWidth={1.5} />;
        }

        return <File className="text-slate-400" size={viewMode === 'grid' ? 56 : 24} strokeWidth={1.5} />;
    };

    const handleClick = (e) => {
        // Handle selection with modifiers
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            onSelect(node, e);
            return;
        }

        // Navigate or Preview
        if (node.type === 'folder') {
            onNavigate(node);
        } else {
            onPreview(node);
        }
    };

    const handleDragStart = (e) => {
        e.dataTransfer.setData('application/json', JSON.stringify(node));
        e.dataTransfer.effectAllowed = 'move';
        // Add a nice drag image if possible, or let browser handle it
        onDragStart?.(node);
    };

    const handleDragOver = (e) => {
        if (node.type === 'folder') {
            e.preventDefault(); // Allow dropping
            e.currentTarget.classList.add('bg-indigo-50', 'border-indigo-300');
        }
    };

    const handleDragLeave = (e) => {
        if (node.type === 'folder') {
            e.currentTarget.classList.remove('bg-indigo-50', 'border-indigo-300');
        }
    };

    const handleDrop = (e) => {
        if (node.type === 'folder') {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('bg-indigo-50', 'border-indigo-300');

            // Get stringified node data
            try {
                const draggedNode = JSON.parse(e.dataTransfer.getData('application/json'));
                if (draggedNode.id !== node.id) { // Don't drop on self
                    onDrop(draggedNode, node);
                }
            } catch (err) {
                // Ignore external files drop here (handled by dashboard)
            }
        }
    };

    // ... rest ...

    const handleContextMenu = (e) => {
        e.preventDefault();
        onContextMenu(e, node);
    };

    const handleDownloadClick = (e) => {
        e.stopPropagation();
        onDownload(node);
    };

    const handleMoreClick = (e) => {
        e.stopPropagation();
        onContextMenu(e, node);
    };

    if (viewMode === 'grid') {
        return (
            <div
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative bg-white rounded-2xl p-4 transition-all cursor-pointer border
                    ${isSelected
                        ? 'border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)] bg-indigo-50/10'
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1'
                    }
                `}
            >
                {/* Visual Selection Indicator */}
                {isSelected && (
                    <div className="absolute top-3 left-3 w-3 h-3 bg-indigo-500 rounded-full shadow-sm" />
                )}

                {/* Quick Actions on Hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button
                        onClick={handleMoreClick}
                        className="p-1.5 bg-white/90 backdrop-blur hover:bg-indigo-50 rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors"
                        title="More actions"
                    >
                        <MoreVertical size={14} />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="mb-4 drop-shadow-sm transform transition-transform group-hover:scale-110 duration-300">
                        {getFileIcon()}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 truncate w-full px-2" title={node.name}>
                        {node.name}
                    </p>
                    {node.type === 'file' && (
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                            {formatBytes(node.size)}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // List view
    return (
        <div
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            draggable={true}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0
                ${isSelected ? 'bg-indigo-50/30' : ''}
            `}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 group-hover:border-indigo-100 group-hover:bg-white transition-colors">
                    {getFileIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {node.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-400 capitalize bg-slate-100 px-1.5 py-0.5 rounded-md">
                            {node.type}
                        </p>
                        {isSelected && <span className="text-xs text-indigo-500 font-medium">Selected</span>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="text-sm text-slate-500 hidden md:block w-24 text-right">
                    {node.type === 'file' ? formatBytes(node.size) : '--'}
                </div>
                <div className="text-sm text-slate-500 hidden lg:block w-32 text-right">
                    {new Date(node.updated_at).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity w-20 justify-end">
                    {node.type === 'file' && (
                        <button
                            onClick={handleDownloadClick}
                            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
                            title="Download"
                        >
                            <Download size={16} />
                        </button>
                    )}
                    <button
                        onClick={handleMoreClick}
                        className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
                        title="More actions"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NodeItem;
