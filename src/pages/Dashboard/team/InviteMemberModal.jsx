import React, { useState, useEffect } from 'react';
import { Mail, X, Shield, Lock, Check, ChevronDown, ChevronRight, Settings, FileText, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePermissions } from '../../../hooks/usePermissions';

const InviteMemberModal = ({ isOpen, onClose, onInvite }) => {
    const { matrix } = usePermissions();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Group permissions by category (document, team, settings)
    const permissionGroups = React.useMemo(() => {
        if (!matrix.permissions) return {};
        return matrix.permissions.reduce((acc, perm) => {
            const category = perm.key.split('.')[0]; // 'document', 'team', etc.
            if (!acc[category]) acc[category] = [];
            acc[category].push(perm);
            return acc;
        }, {});
    }, [matrix.permissions]);

    // Update selected permissions when role changes
    useEffect(() => {
        if (!isOpen) {
            // Optional reset
        }
    }, [isOpen]);

    useEffect(() => {
        if (!matrix.permissions) return;

        // Auto-select permissions based on role
        const rolePermissions = matrix.permissions
            .filter(p => p.roles.includes(role))
            .map(p => p.key);

        setSelectedPermissions(rolePermissions);
    }, [role, matrix]);

    const handlePermissionToggle = (permissionKey) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionKey)) {
                return prev.filter(k => k !== permissionKey);
            } else {
                return [...prev, permissionKey];
            }
        });
    };

    const getRoleIcon = (r) => {
        switch (r) {
            case 'admin': return <Shield className="text-purple-600" size={24} />;
            case 'editor': return <FileText className="text-blue-600" size={24} />;
            case 'member': return <Users className="text-slate-600" size={24} />;
            case 'viewer': return <Check className="text-emerald-600" size={24} />;
            default: return <Users className="text-slate-600" size={24} />; // Changed from User to Users as User is not imported
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onInvite({ email, role, permissions: selectedPermissions });
            resetForm();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setRole('member');
        setShowAdvanced(false);
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
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header with Pattern */}
                <div className="relative px-8 py-6 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>
                    <div className="relative flex items-center justify-between z-10">
                        <div>
                            <h3 className="text-xl font-bold text-white">Invite Team Member</h3>
                            <p className="text-slate-400 text-sm mt-1">Send an invitation to join your workspace.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <form id="inviteForm" onSubmit={handleSubmit} className="space-y-8">

                        {/* Email Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 bg-slate-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Role Selection Cards */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Select Role</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['admin', 'editor', 'member', 'viewer'].map((r) => (
                                    <label
                                        key={r}
                                        className={`
                                            relative flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200
                                            ${role === r
                                                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-sm'
                                                : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={r}
                                            checked={role === r}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`mt-1 p-2 rounded-lg ${role === r ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                            {getRoleIcon(r)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-semibold capitalize ${role === r ? 'text-indigo-900' : 'text-slate-900'}`}>{r}</span>
                                                {role === r && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {r === 'admin' && 'Full workspace access. Can manage settings & team.'}
                                                {r === 'editor' && 'Can create, edit, and delete content.'}
                                                {r === 'member' && 'Can view and comment on shared documents.'}
                                                {r === 'viewer' && 'Read-only access to specific items.'}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Permissions Section */}
                        <div className="border-t border-slate-100 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                <Lock size={16} />
                                <span>Advanced Permission Settings</span>
                                {!showAdvanced && (
                                    <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                        {selectedPermissions.length} selected
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 space-y-6">
                                            {Object.entries(permissionGroups).map(([category, perms]) => (
                                                <div key={category} className="space-y-3">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        {category === 'document' && <FileText size={12} />}
                                                        {category === 'team' && <Users size={12} />}
                                                        {category === 'settings' && <Settings size={12} />}
                                                        {category} Permissions
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {perms.map(perm => {
                                                            const isSelected = selectedPermissions.includes(perm.key);
                                                            return (
                                                                <label key={perm.key} className={`
                                                                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                                                    ${isSelected
                                                                        ? 'bg-indigo-50 border-indigo-200'
                                                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                                                    }
                                                                `}>
                                                                    <div className={`
                                                                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                                        ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}
                                                                    `}>
                                                                        {isSelected && <Check size={12} className="text-white" />}
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isSelected}
                                                                            onChange={() => handlePermissionToggle(perm.key)}
                                                                            className="hidden"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                                            {perm.label}
                                                                        </div>
                                                                    </div>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 sticky bottom-0 z-20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="inviteForm"
                        disabled={loading}
                        className="px-8 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending Invitation...
                            </>
                        ) : (
                            <>
                                <Mail size={18} />
                                Send Invitation
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default InviteMemberModal;
