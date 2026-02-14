import React, { useState, useEffect } from 'react';
import { X, Shield, Plus, Trash2, Edit3, Check, Save, Lock, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRole, updateRole, deleteRole } from '../../../api/roles';
import { toast } from 'react-hot-toast';
import { usePermissions } from '../../../hooks/usePermissions';

const ManageRoleModal = ({ isOpen, onClose, roles, onRolesUpdated }) => {
    const { matrix } = usePermissions();
    const [view, setView] = useState('list'); // list, create, edit
    const [formData, setFormData] = useState({ name: '', label: '', description: '', permissions: [] });
    const [loading, setLoading] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});

    // Group permissions
    const permissionGroups = React.useMemo(() => {
        if (!matrix.permissions) return {};
        // Use backend permissions if available from matrix, otherwise empty
        // The matrix from usePermissions might be the "effective" permissions of current user, 
        // but for role management we need ALL defined permissions.
        // Assuming matrix.permissions contains all system permissions.
        return matrix.permissions.reduce((acc, perm) => {
            const category = perm.key.split('.')[0];
            if (!acc[category]) acc[category] = [];
            acc[category].push(perm);
            return acc;
        }, {});
    }, [matrix.permissions]);

    useEffect(() => {
        if (!isOpen) {
            setView('list');
            setFormData({ name: '', label: '', description: '', permissions: [] });
        }
    }, [isOpen]);

    const handleEdit = (role) => {
        setFormData({
            id: role.id,
            name: role.name,
            label: role.label,
            description: role.description || '',
            permissions: role.permissions ? role.permissions.map(p => p.id) : []
        });
        setView('edit');
    };

    const handleDelete = async (roleId) => {
        if (!confirm('Are you sure you want to delete this role? Users assigned to this role will lose their permissions.')) return;
        try {
            await deleteRole(roleId);
            toast.success('Role deleted successfully');
            onRolesUpdated();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete role');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (view === 'create') {
                await createRole(formData);
                toast.success('Role created successfully');
            } else {
                await updateRole(formData.id, formData);
                toast.success('Role updated successfully');
            }
            onRolesUpdated();
            setView('list');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save role');
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = (permId) => {
        setFormData(prev => {
            const newPerms = prev.permissions.includes(permId)
                ? prev.permissions.filter(p => p !== permId)
                : [...prev.permissions, permId];
            return { ...prev, permissions: newPerms };
        });
    };

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-8 py-6 bg-slate-900 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {view === 'list' ? 'Manage Roles' : view === 'create' ? 'Create New Role' : 'Edit Role'}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                            {view === 'list'
                                ? 'Create and manage custom roles for your team.'
                                : 'Configure role details and permissions.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    {view === 'list' ? (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        setFormData({ name: '', label: '', description: '', permissions: [] });
                                        setView('create');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    <Plus size={18} />
                                    Create Custom Role
                                </button>
                            </div>

                            <div className="space-y-4">
                                {roles.map(role => (
                                    <div key={role.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between hover:border-indigo-200 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-semibold text-slate-900 text-lg">{role.label}</h4>
                                                {role.is_system && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full flex items-center gap-1">
                                                        <Shield size={10} /> System
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm mt-1">{role.description}</p>
                                        </div>

                                        {!role.is_system && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(role)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Role"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(role.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Role"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                        {role.is_system && (
                                            <div className="p-2 text-slate-300 cursor-not-allowed" title="System roles cannot be modified">
                                                <Lock size={18} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form id="roleForm" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700">Role Name (Label)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.label}
                                        onChange={e => setFormData({ ...formData, label: e.target.value, name: view === 'create' ? e.target.value.toLowerCase().replace(/\s+/g, '-') : formData.name })}
                                        placeholder="e.g. Junior Editor"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700">Role ID (Slug)</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={view === 'edit'}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">Permissions</h4>
                                <div className="space-y-4">
                                    {Object.entries(permissionGroups).map(([category, perms]) => {
                                        const selectedCount = perms.filter(p => formData.permissions.includes(p.id)).length;
                                        const isAllSelected = selectedCount === perms.length;

                                        return (
                                            <div key={category} className="border border-slate-200 rounded-xl overflow-hidden transition-all hover:border-indigo-200">
                                                <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleGroup(category)}
                                                        className="flex-1 text-left font-medium text-slate-700 capitalize flex items-center gap-2 hover:text-indigo-700 transition-colors"
                                                    >
                                                        {expandedGroups[category] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                        {category}
                                                    </button>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${selectedCount > 0 ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                                                            {selectedCount} / {perms.length}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const groupIds = perms.map(p => p.id);
                                                                setFormData(prev => {
                                                                    if (isAllSelected) {
                                                                        // Deselect all
                                                                        return { ...prev, permissions: prev.permissions.filter(id => !groupIds.includes(id)) };
                                                                    } else {
                                                                        // Select all (adding missing ones)
                                                                        const newPerms = [...prev.permissions];
                                                                        groupIds.forEach(id => {
                                                                            if (!newPerms.includes(id)) newPerms.push(id);
                                                                        });
                                                                        return { ...prev, permissions: newPerms };
                                                                    }
                                                                });
                                                            }}
                                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline px-2"
                                                        >
                                                            {isAllSelected ? 'Deselect All' : 'Select All'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {expandedGroups[category] && (
                                                    <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
                                                        {perms.map(perm => (
                                                            <label key={perm.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group border border-transparent hover:border-slate-100">
                                                                <div className={`mt-0.5
                                                                    w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0
                                                                    ${formData.permissions.includes(perm.id)
                                                                        ? 'bg-indigo-600 border-indigo-600'
                                                                        : 'bg-white border-slate-300 group-hover:border-indigo-300'}
                                                                `}>
                                                                    {formData.permissions.includes(perm.id) && <Check size={12} className="text-white" />}
                                                                    <input
                                                                        type="checkbox"
                                                                        className="hidden"
                                                                        checked={formData.permissions.includes(perm.id)}
                                                                        onChange={() => togglePermission(perm.id)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-slate-700 group-hover:text-indigo-900">{perm.label}</div>
                                                                    <div className="text-xs text-slate-400 font-mono mt-0.5 mb-1">{perm.key}</div>
                                                                    {perm.description && (
                                                                        <div className="text-xs text-slate-500 leading-tight">{perm.description}</div>
                                                                    )}
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center sticky bottom-0 z-20">
                    {view !== 'list' && (
                        <button
                            type="button"
                            onClick={() => setView('list')}
                            className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
                        >
                            Back to List
                        </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors"
                        >
                            Close
                        </button>
                        {view !== 'list' && (
                            <button
                                type="submit"
                                form="roleForm"
                                disabled={loading}
                                className="px-8 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                {view === 'create' ? 'Create Role' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ManageRoleModal;
