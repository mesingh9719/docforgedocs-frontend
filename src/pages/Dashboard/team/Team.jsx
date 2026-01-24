import React, { useState, useEffect } from 'react';
import { getTeamMembers, inviteMember, updateMember, removeMember } from '../../../api/team';
import { useAuth } from '../../../context/AuthContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { Plus, Search, MoreVertical, Shield, Trash2, Mail, User, Briefcase, CheckCircle, Edit3, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InviteMemberModal from './InviteMemberModal';
import EditMemberModal from './EditMemberModal';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';

const Team = () => {
    const { user } = useAuth();
    const { matrix } = usePermissions();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null); // Member being edited
    const [activeTab, setActiveTab] = useState('members');
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await getTeamMembers();
            setMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch team", error);
        } finally {
            setLoading(false);
        }
    };



    const handleUpdateMember = async (id, data) => {
        try {
            await updateMember(id, data);
            fetchMembers();
            toast.success("Member updated successfully");
        } catch (error) {
            console.error("Failed to update member", error);
            toast.error("Failed to update member: " + (error.response?.data?.message || error.message));
        }
    };

    const handleRemove = async (id) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await removeMember(id);
            setMembers(members.filter(m => m.id !== id));
            toast.success("Member removed successfully");
        } catch (error) {
            console.error("Failed to remove member", error);
            toast.error("Failed to remove member");
        }
        setActiveMenu(null);
    };

    const handleInvite = async (data) => {
        try {
            await inviteMember(data);
            fetchMembers();
            setIsInviteModalOpen(false);
            toast.success("Invitation sent successfully");
        } catch (error) {
            console.error("Failed to invite member", error);
            toast.error("Failed to invite member: " + (error.response?.data?.message || error.message));
        }
    };

    const filteredMembers = members.filter(m =>
        m.child?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.child?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'editor': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'member': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'viewer': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-slate-100 text-slate-500';
        }
    };



    return (
        <div className="max-w-7xl mx-auto">
            <DashboardPageHeader
                title="Team Management"
                subtitle="Manage your team members and their roles."
            >
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 text-sm"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Invite Member
                </button>
            </DashboardPageHeader>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'members' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Members
                        {activeTab === 'members' && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'roles' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Roles & Permissions
                        {activeTab === 'roles' && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'members' ? (
                    <motion.div
                        key="members"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Search */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6 flex items-center gap-3">
                            <Search className="text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search members by name or email..."
                                className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* List */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredMembers.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                            <Shield className="text-slate-300" size={32} />
                                                        </div>
                                                        <h3 className="text-lg font-medium text-slate-900 mb-1">No team members yet</h3>
                                                        <p className="text-slate-500 text-sm max-w-sm">
                                                            Invite your colleagues to collaborate on documents and manage your business together.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredMembers.map((member) => (
                                                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                                                                {member.child?.name?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-900">{member.child?.name || 'Unknown User'}</div>
                                                                <div className="text-sm text-slate-500">{member.child?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(member.role)} capitalize`}>
                                                                {member.role || 'Member'}
                                                            </span>
                                                            {member.permissions && (
                                                                <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                                                    <Lock size={10} />
                                                                    Custom Access
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                                                                }`} />
                                                            {member.status === 'active' ? 'Active' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="relative group inline-block text-left">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveMenu(activeMenu === member.id ? null : member.id);
                                                                }}
                                                                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>

                                                            {activeMenu === member.id && (
                                                                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingMember(member);
                                                                            setActiveMenu(null);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
                                                                    >
                                                                        <Edit3 size={14} />
                                                                        Edit Access
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRemove(member.id)}
                                                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 mt-1"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                        Remove Member
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="roles"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 bg-slate-50">
                                <h3 className="text-lg font-semibold text-slate-900">Role Permissions</h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    View access levels for each role. (Read-only reference)
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-slate-200">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3 border-r border-slate-100">Permission</th>
                                            {matrix.roles && Object.keys(matrix.roles).map(roleKey => (
                                                <th key={roleKey} className="px-6 py-4 text-xs font-semibold text-center text-slate-500 uppercase tracking-wider w-1/6">
                                                    {matrix.roles[roleKey]}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {matrix.permissions && matrix.permissions.map((perm) => (
                                            <tr key={perm.key} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-700 border-r border-slate-100">
                                                    {perm.label}
                                                    <div className="text-xs text-slate-400 font-normal mt-0.5">{perm.key}</div>
                                                </td>
                                                {Object.keys(matrix.roles).map(roleKey => {
                                                    const hasAccess = perm.roles.includes(roleKey);
                                                    return (
                                                        <td key={roleKey} className="px-6 py-4 text-center">
                                                            {hasAccess ? (
                                                                <CheckCircle size={18} className="mx-auto text-emerald-500" />
                                                            ) : (
                                                                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mx-auto" />
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for menu */}
            {activeMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
            )}

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
            />

            <EditMemberModal
                isOpen={!!editingMember}
                onClose={() => setEditingMember(null)}
                member={editingMember}
                onUpdate={handleUpdateMember}
            />
        </div>
    );
};

export default Team;
