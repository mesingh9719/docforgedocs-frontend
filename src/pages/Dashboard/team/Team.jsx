import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getTeamMembers, inviteMember, updateMember, removeMember } from '../../../api/team';
import { getRoles } from '../../../api/roles';
import { useAuth } from '../../../context/AuthContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { Plus, Search, MoreVertical, Shield, Trash2, Edit3, Lock, Settings, UserPlus, CheckCircle, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import InviteMemberModal from './InviteMemberModal';
import EditMemberModal from './EditMemberModal';
import ManageRoleModal from './ManageRoleModal';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';
import DashboardPage from '../../../components/Dashboard/DashboardPage';

const Team = () => {
    const { user } = useAuth();
    const { matrix } = usePermissions();
    const [members, setMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null); // Member being edited
    const [activeTab, setActiveTab] = useState('members');
    const [activeMenu, setActiveMenu] = useState(null);

    const { can } = usePermissions();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchMembers(), fetchRoles()]);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await getTeamMembers();
            setMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch team members", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error("Failed to fetch roles", error);
        }
    };

    const handleUpdateMember = async (id, data) => {
        try {
            const response = await updateMember(id, data);
            setMembers(members.map(m => m.id === id ? response.data : m));
            setEditingMember(null);
            toast.success('Member updated successfully');
        } catch (error) {
            console.error("Failed to update member", error);
            toast.error('Failed to update member');
        }
    };

    const handleDeleteMember = async (id) => {
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            await removeMember(id);
            setMembers(members.filter(m => m.id !== id));
            toast.success('Member removed successfully');
        } catch (error) {
            console.error("Failed to remove member", error);
            toast.error('Failed to remove member');
        }
    };

    const handleInvite = async (data) => {
        try {
            const response = await inviteMember(data);
            setMembers([...members, response.data]);
            setIsInviteModalOpen(false);
            toast.success('Invitation sent successfully');
        } catch (error) {
            console.error("Failed to invite member", error);
            toast.error(error.response?.data?.message || 'Failed to send invitation');
        }
    };

    const filteredMembers = members.filter(m =>
        m.child?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.child?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (roleName) => {
        switch (roleName) {
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
        <DashboardPage>
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
                        className={`pb - 3 text - sm font - medium transition - colors relative ${activeTab === 'members' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            } `}
                    >
                        Members
                        {activeTab === 'members' && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`pb - 3 text - sm font - medium transition - colors relative ${activeTab === 'roles' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            } `}
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
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
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
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-indigo-50/50">
                                                            <Users className="text-indigo-500" size={32} />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Build Your Team</h3>
                                                        <p className="text-slate-500 text-sm mb-6 text-center">
                                                            Invite colleagues to collaborate on documents, manage templates, and streamline your workflow together.
                                                        </p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setIsInviteModalOpen(true);
                                                            }}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                                                        >
                                                            <Plus size={18} strokeWidth={2.5} />
                                                            Invite First Member
                                                        </button>
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
                                                            <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium border ${getRoleColor(member.role)} capitalize`}>
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
                                                        <span className={`inline - flex items - center gap - 1.5 px - 2.5 py - 0.5 rounded - full text - xs font - medium border ${getStatusColor(member.status)} `}>
                                                            <div className={`w - 1.5 h - 1.5 rounded - full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                                                                } `} />
                                                            {member.status === 'active' ? 'Active' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="relative group inline-block text-left">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                                    setActiveMenu(activeMenu === member.id ? null : {
                                                                        id: member.id,
                                                                        top: rect.bottom + window.scrollY,
                                                                        left: rect.right - 192
                                                                    });
                                                                }}
                                                                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-slate-100">
                                {loading ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                    </div>
                                ) : filteredMembers.length === 0 ? (
                                    <div className="p-8 text-center flex flex-col items-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <Shield className="text-slate-300" size={24} />
                                        </div>
                                        <p className="text-slate-500 text-sm">No members found.</p>
                                    </div>
                                ) : (
                                    filteredMembers.map((member) => (
                                        <div key={member.id} className="p-4 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                                                        {member.child?.name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{member.child?.name || 'Unknown User'}</div>
                                                        <div className="text-sm text-slate-500">{member.child?.email}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setActiveMenu(activeMenu === member.id ? null : {
                                                            id: member.id,
                                                            top: rect.bottom + window.scrollY,
                                                            left: rect.right - 192
                                                        });
                                                    }}
                                                    className="p-1 text-slate-400"
                                                >
                                                    <MoreVertical size={20} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 pl-13">
                                                <span className={`inline - flex items - center px - 2 py - 0.5 rounded - full text - xs font - medium border ${getRoleColor(member.role)} capitalize`}>
                                                    {member.role || 'Member'}
                                                </span>
                                                <span className={`inline - flex items - center gap - 1.5 px - 2 py - 0.5 rounded - full text - xs font - medium border ${getStatusColor(member.status)} `}>
                                                    <div className={`w - 1.5 h - 1.5 rounded - full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'} `} />
                                                    {member.status === 'active' ? 'Active' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
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
                            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Role Permissions</h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        View and manage access levels for your team.
                                    </p>
                                </div>
                                {can('team.roles.manage') && (
                                    <button
                                        onClick={() => setIsRoleModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm"
                                    >
                                        <Settings size={16} />
                                        Manage Roles
                                    </button>
                                )}
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

            {/* Fixed Position Menu (Portal-like behavior) */}
            {activeMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                    <div
                        className="fixed z-50 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right"
                        style={{ top: activeMenu.top + 5, left: activeMenu.left }}
                    >
                        <button
                            onClick={() => {
                                // Find member by ID since activeMenu is now an object
                                const member = members.find(m => m.id === activeMenu.id);
                                if (member) setEditingMember(member);
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
                        >
                            <Edit3 size={14} />
                            Edit Access
                        </button>
                        <button
                            onClick={() => {
                                handleRemove(activeMenu.id);
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 mt-1"
                        >
                            <Trash2 size={14} />
                            Remove Member
                        </button>
                    </div>
                </>
            )}

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
                roles={roles}
            />

            <EditMemberModal
                isOpen={!!editingMember}
                onClose={() => setEditingMember(null)}
                member={editingMember}
                onUpdate={handleUpdateMember}
                roles={roles}
            />

            <ManageRoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                roles={roles}
                onRolesUpdated={fetchRoles}
            />
        </DashboardPage>
    );
};

export default Team;
