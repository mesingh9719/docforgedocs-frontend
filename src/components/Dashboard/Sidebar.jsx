import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    FileText,
    Building2,
    Shield,
    PenTool
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ business, mobileMenuOpen, setMobileMenuOpen }) => {
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();
    const { can } = usePermissions();
    const { logout } = useAuth();

    const toggleSidebar = () => setCollapsed(!collapsed);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const businessName = business?.name || 'DocForge';

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },

        { icon: FileText, label: 'Documents', path: '/documents', permission: 'document.view' },

        { icon: PenTool, label: 'Signatures', path: '/signatures', permission: 'signature.view' },

        { icon: Users, label: 'Team', path: '/team', permission: 'team.view' },

        { icon: Settings, label: 'Settings', path: '/settings', permission: 'settings.manage' },
    ].filter(item => !item.permission || can(item.permission));

    return (
        <motion.aside
            initial={false}
            animate={
                isMobile
                    ? { x: mobileMenuOpen ? 0 : -300, position: 'fixed', height: '100%' }
                    : { width: collapsed ? 80 : 280, x: 0, position: 'sticky' }
            }
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`
                no-print h-screen bg-[#0F172A] text-slate-400 flex flex-col justify-between
                z-50 border-r border-slate-800 shadow-2xl
                lg:sticky lg:top-0 fixed top-0 left-0
                ${mobileMenuOpen ? 'w-[280px]' : ''}
            `}
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between h-20 border-b border-slate-800/80">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Building2 size={18} strokeWidth={2.5} />
                    </div>

                    {(!collapsed || mobileMenuOpen) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <span className="font-bold text-lg text-white block leading-none">
                                {businessName}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                                Workspace
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Desktop Collapse */}
                <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 hidden lg:block"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                {/* Mobile Close */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 lg:hidden"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-1">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3.5 rounded-xl transition-all group relative
                             ${isActive
                                ? 'bg-indigo-600/10 text-white'
                                : 'hover:bg-white/5 hover:text-slate-200'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"
                                    />
                                )}

                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />

                                {(!collapsed || mobileMenuOpen) && (
                                    <span className="ml-4 text-sm font-medium">
                                        {item.label}
                                    </span>
                                )}

                                {/* Tooltip */}
                                {collapsed && !mobileMenuOpen && (
                                    <div className="hidden lg:block absolute left-full ml-4 px-3 py-1.5 bg-slate-800
                                        text-xs text-white rounded-md opacity-0 group-hover:opacity-100 transition">
                                        {item.label}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/80">
                {(!collapsed || mobileMenuOpen) && (
                    <div className="mb-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="text-xs font-bold text-slate-300">Pro Plan</p>
                        <p className="text-[10px] text-slate-500 mt-1">Manage team access</p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className={`flex items-center w-full rounded-xl text-slate-400 hover:text-red-400
                        hover:bg-red-500/10 transition
                        ${collapsed ? 'justify-center p-3' : 'px-4 py-3'}`}
                >
                    <LogOut size={20} />
                    {(!collapsed || mobileMenuOpen) && (
                        <span className="ml-3 text-sm font-medium">Log Out</span>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
