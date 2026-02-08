import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useDrive = () => {
    const navigate = useNavigate();

    // --- State ---
    const [originalNodes, setOriginalNodes] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [parentId, setParentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);

    // Premium & New Features Actions
    const [currentView, setCurrentView] = useState('root'); // 'root', 'recent', 'favorites', 'trash'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterType, setFilterType] = useState('all');
    const [selectedNodes, setSelectedNodes] = useState(new Set());
    const [clipboard, setClipboard] = useState(null);

    // Persistence
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('drive_favorites');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch { return new Set(); }
    });
    const [recentFiles, setRecentFiles] = useState(() => {
        try {
            const saved = localStorage.getItem('drive_recent');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('drive_favorites', JSON.stringify([...favorites]));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('drive_recent', JSON.stringify(recentFiles));
    }, [recentFiles]);

    // --- Fetching ---
    const fetchNodes = useCallback(async (pid = null) => {
        setLoading(true);
        try {
            // If view is NOT root, we might want to adapt fetch logic or just fetch root and filter
            // For now, consistent fetch
            const url = pid ? `/drive/nodes?parent_id=${pid}` : '/drive/nodes';
            const response = await axios.get(url);
            setOriginalNodes(response.data.nodes || []);
            setBreadcrumbs(response.data.breadcrumbs || []);
        } catch (error) {
            console.error('Failed to fetch nodes:', error);
            toast.error('Failed to load files');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentView === 'root') {
            fetchNodes(parentId);
        } else if (currentView === 'trash') {
            // Assuming separate page handled by react-router, but if handled here:
            // fetchNodes('trash'); // placeholder
            navigate('/drive/trash');
        } else {
            // For recent/favorites, we reload root to get fresh metadata if needed
            fetchNodes(null);
        }
    }, [parentId, currentView, fetchNodes, navigate]);


    // --- Core Actions ---

    const handleNavigate = (node) => {
        setParentId(node ? node.id : null);
        setSelectedNodes(new Set());
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'file');
            if (parentId) formData.append('parent_id', parentId);

            try {
                await axios.post('/drive/nodes', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return { success: true, name: file.name };
            } catch (error) {
                console.error(`Upload failed for ${file.name}:`, error);
                return { success: false, name: file.name };
            }
        });

        const results = await Promise.all(uploadPromises);
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        if (successful > 0) {
            toast.success(`${successful} file(s) uploaded`);
            fetchNodes(parentId);
        }
        if (failed > 0) {
            toast.error(`${failed} file(s) failed`);
        }
        setUploading(false);
    };

    const handleCreateFolder = async (folderName) => {
        try {
            await axios.post('/drive/nodes', {
                type: 'folder',
                name: folderName,
                parent_id: parentId
            });
            toast.success('Folder created');
            fetchNodes(parentId);
        } catch (error) {
            console.error('Create folder failed:', error);
            toast.error('Failed to create folder');
        }
    };

    const handleRename = async (nodeId, newName) => {
        try {
            await axios.patch(`/drive/nodes/${nodeId}/rename`, { name: newName });
            toast.success('Item renamed');
            fetchNodes(parentId);
        } catch (error) {
            console.error('Rename failed:', error);
            toast.error('Failed to rename item');
        }
    };

    const handleDelete = async (node) => {
        // Confirm logic should be in UI component, here we just execute
        try {
            await axios.delete(`/drive/nodes/${node.id}`);
            toast.success('Item moved to trash');
            fetchNodes(parentId);
            // Remove from selection if it was selected
            if (selectedNodes.has(node.id)) {
                const newSel = new Set(selectedNodes);
                newSel.delete(node.id);
                setSelectedNodes(newSel);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete item');
        }
    };

    const handleCut = (node) => {
        setClipboard({ node, operation: 'cut' });
        toast.success(`"${node.name}" ready to move`);
    };

    const handleCopy = (node) => {
        setClipboard({ node, operation: 'copy' });
        toast.success(`"${node.name}" copied to clipboard`);
    };

    const handlePaste = async (targetNode) => {
        if (!clipboard) return;
        const targetParentId = targetNode?.type === 'folder' ? targetNode.id : parentId;
        try {
            if (clipboard.operation === 'cut') {
                await axios.patch(`/drive/nodes/${clipboard.node.id}/move`, { parent_id: targetParentId });
                toast.success(`Moved successfully`);
                setClipboard(null);
            } else {
                await axios.post(`/drive/nodes/${clipboard.node.id}/copy`, { parent_id: targetParentId });
                toast.success(`Copied successfully`);
            }
            fetchNodes(parentId);
        } catch (error) {
            console.error('Paste failed:', error);
            toast.error('Failed to paste item');
        }
    };

    const handleMove = (draggedNode, targetFolder) => {
        return axios.patch(`/drive/nodes/${draggedNode.id}/move`, { parent_id: targetFolder.id })
            .then(() => {
                toast.success(`Moved "${draggedNode.name}" to "${targetFolder.name}"`);
                fetchNodes(parentId);
            })
            .catch(error => {
                console.error('Move failed:', error);
                toast.error('Failed to move item');
            });
    };

    // --- Helpers ---

    const toggleFavorite = (node) => {
        const newFavs = new Set(favorites);
        if (newFavs.has(node.id)) {
            newFavs.delete(node.id);
            toast.success('Removed from favorites');
        } else {
            newFavs.add(node.id);
            toast.success('Added to favorites');
        }
        setFavorites(newFavs);
    };

    const addToRecent = (node) => {
        setRecentFiles(prev => {
            const temp = prev.filter(n => n.id !== node.id);
            return [node, ...temp].slice(0, 50);
        });
    };

    const handleNodeSelect = (node, e) => {
        const newSelection = new Set(selectedNodes);

        if (e.ctrlKey || e.metaKey) {
            if (newSelection.has(node.id)) {
                newSelection.delete(node.id);
            } else {
                newSelection.add(node.id);
            }
        } else if (e.shiftKey && processedNodes.length > 0) {
            // Range selection requires access to processedNodes order.
            // We'll trust the caller to handle complex range logic or pass processedNodes here.
            // Simplified here: toggle if not range able immediately
            // Or better: let UI handle complex range logic, just expose setter
            if (newSelection.has(node.id)) newSelection.delete(node.id);
            else newSelection.add(node.id);
        } else {
            newSelection.clear();
            newSelection.add(node.id);
        }
        setSelectedNodes(newSelection);
    };

    // --- Computed Data ---
    const processedNodes = useMemo(() => {
        let nodes = [...originalNodes];

        // 1. Search
        if (searchQuery) {
            nodes = nodes.filter(node =>
                node.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2. View Filter
        if (currentView === 'recent') {
            nodes = [...recentFiles];
        } else if (currentView === 'favorites') {
            const allKnownNodes = [...originalNodes, ...recentFiles];
            const uniqueNodes = Array.from(new Map(allKnownNodes.map(item => [item.id, item])).values());
            nodes = uniqueNodes.filter(n => favorites.has(n.id));
        }

        // 3. Type Filter
        if (filterType !== 'all') {
            nodes = nodes.filter(node => {
                if (filterType === 'folder') return node.type === 'folder';
                if (filterType === 'image') return node.mime_type?.startsWith('image/');
                if (filterType === 'document') return node.mime_type === 'application/pdf' || node.mime_type?.includes('document') || node.mime_type?.includes('text');
                return true;
            });
        }

        // 4. Sorting
        nodes.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'size') {
                comparison = (a.size || 0) - (b.size || 0);
            } else if (sortBy === 'date') {
                comparison = new Date(a.updated_at) - new Date(b.updated_at);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return nodes;
    }, [originalNodes, searchQuery, currentView, sortBy, sortOrder, filterType, recentFiles, favorites]);


    return {
        // State
        nodes: processedNodes,
        originalNodes,
        breadcrumbs,
        loading,
        uploading,
        viewMode,
        currentView,
        parentId,
        searchQuery,
        sortBy,
        sortOrder,
        filterType,
        selectedNodes,
        clipboard,
        favorites,

        // Setters
        setViewMode,
        setCurrentView,
        setSearchQuery,
        setSortBy,
        setSortOrder,
        setFilterType,
        setSelectedNodes,
        setClipboard,
        setParentId, // Exposed if manual set needed

        // Actions
        fetchNodes,
        onNavigate: handleNavigate,
        onFileUpload: handleFileUpload,
        onCreateFolder: handleCreateFolder,
        onRename: handleRename,
        onDelete: handleDelete,
        onPaste: handlePaste,
        onMove: handleMove,
        onSelect: handleNodeSelect,
        onAddToRecent: addToRecent,
        onToggleFavorite: toggleFavorite,
        onCut: handleCut,
        onCopy: handleCopy,

        // Drag Helpers
        // (UI components handle drag UI state, hook handles logic)
    };
};

export default useDrive;
