import React, { useEffect, useRef } from 'react';
import {
    MoreVertical,
    Download,
    Edit2,
    Trash2,
    FolderInput,
    Scissors,
    Copy,
    Clipboard,
    Upload,
    FolderPlus,
    RefreshCw,
    Star,
    Share2
} from 'lucide-react';

const ContextMenu = ({
    x,
    y,
    node,
    isBackground,
    onClose,
    onRename,
    onDownload,
    onDelete,
    onMove,
    onCut,
    onCopy,
    onPaste,
    onCreateFolder,
    onUpload,
    onRefresh,
    clipboardState,
    onAddToFavorites,
    isFavorite
}) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        // Prevent default browser context menu inside custom context menu
        const handleContextMenu = (e) => {
            if (menuRef.current && menuRef.current.contains(e.target)) {
                e.preventDefault();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [onClose]);

    // Background context menu
    if (isBackground) {
        return (
            <div
                ref={menuRef}
                className="fixed bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-100 py-2 z-50 min-w-[220px] animate-in fade-in zoom-in-95 duration-100"
                style={{ top: `${y}px`, left: `${x}px` }}
            >
                <div className="px-2">
                    <button
                        onClick={() => { onCreateFolder(); onClose(); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group"
                    >
                        <FolderPlus size={16} className="text-slate-400 group-hover:text-indigo-600" />
                        <span className="font-medium">New Folder</span>
                    </button>
                    <button
                        onClick={() => { onUpload(); onClose(); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group"
                    >
                        <Upload size={16} className="text-slate-400 group-hover:text-indigo-600" />
                        <span className="font-medium">Upload File</span>
                    </button>
                </div>

                <div className="h-px bg-slate-100 my-1 mx-2"></div>

                <div className="px-2">
                    {clipboardState && (
                        <button
                            onClick={() => { onPaste(null); onClose(); }}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Clipboard size={16} />
                                <span>Paste {clipboardState.operation === 'cut' ? '(Move)' : '(Copy)'}</span>
                            </div>
                            <span className="text-xs opacity-60">Ctrl+V</span>
                        </button>
                    )}
                    <button
                        onClick={() => { onRefresh?.(); onClose(); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group"
                    >
                        <RefreshCw size={16} className="text-slate-400 group-hover:text-indigo-600" />
                        <span className="font-medium">Refresh</span>
                    </button>
                </div>
            </div>
        );
    }

    // Regular node context menu
    const menuItems = [
        {
            icon: Star,
            label: isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
            action: () => { onAddToFavorites?.(node); onClose(); },
            highlight: isFavorite
        },
        { icon: Share2, label: 'Share', action: () => { onClose(); }, disabled: true }, // Future implementation
        { type: 'separator' },
        ...(node.type === 'file' ? [
            { icon: Download, label: 'Download', action: () => { onDownload(node); onClose(); } },
        ] : []),
        { icon: Edit2, label: 'Rename', action: () => { onRename(node); onClose(); } },
        { type: 'separator' },
        { icon: Scissors, label: 'Cut', action: () => { onCut(node); onClose(); }, shortcut: 'Ctrl+X' },
        { icon: Copy, label: 'Copy', action: () => { onCopy(node); onClose(); }, shortcut: 'Ctrl+C' },
        ...(clipboardState ? [
            {
                icon: Clipboard,
                label: `Paste ${clipboardState.operation === 'cut' ? '(Move)' : '(Copy)'}`,
                action: () => { onPaste(node); onClose(); },
                shortcut: 'Ctrl+V',
                highlight: true
            },
        ] : []),
        { type: 'separator' },
        { icon: FolderInput, label: 'Move to...', action: () => { onMove(node); onClose(); } },
        { icon: Trash2, label: 'Delete', action: () => { onDelete(node); onClose(); }, danger: true },
    ];

    return (
        <div
            ref={menuRef}
            className="fixed bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-100 py-2 z-50 min-w-[220px] animate-in fade-in zoom-in-95 duration-100"
            style={{ top: `${y}px`, left: `${x}px` }}
        >
            {menuItems.map((item, index) => {
                if (item.type === 'separator') {
                    return <div key={index} className="h-px bg-slate-100 my-1 mx-2" />;
                }

                return (
                    <div key={index} className="px-2">
                        <button
                            onClick={item.action}
                            disabled={item.disabled}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors rounded-lg group
                                ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                ${!item.disabled && item.danger
                                    ? 'text-red-600 hover:bg-red-50'
                                    : !item.disabled && item.highlight
                                        ? 'text-indigo-600 hover:bg-indigo-50 font-medium'
                                        : !item.disabled ? 'text-slate-700 hover:bg-slate-100' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={16} className={item.danger ? 'text-red-500' : 'text-slate-400 group-hover:text-indigo-500'} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {item.shortcut && (
                                <span className="text-xs text-slate-400">{item.shortcut}</span>
                            )}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ContextMenu;
