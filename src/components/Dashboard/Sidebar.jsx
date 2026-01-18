import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    FileText,
    Building2,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';

import { usePermissions } from '../../hooks/usePermissions';

const Sidebar = ({ business, mobileMenuOpen, setMobileMenuOpen }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { can } = usePermissions();

    const toggleSidebar = () => setCollapsed(!collapsed);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const businessName = business?.name || 'DocForge';

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }, // Public to all
        { icon: FileText, label: 'Documents', path: '/documents', permission: 'document.view' },
        { icon: Users, label: 'Team', path: '/team', permission: 'team.view' },
        { icon: Settings, label: 'Settings', path: '/settings', permission: 'settings.manage' },
    ].filter(item => !item.permission || can(item.permission));

    const sidebarVariants = {
        expanded: { width: 260 },
        collapsed: { width: 72 }
    };

    return (
        <motion.aside
            initial={false}
            animate={
                // Mobile: slide in/out based on mobileMenuOpen
                // Desktop: animate width based on collapsed
                window.innerWidth < 1024
                    ? { x: mobileMenuOpen ? 0 : -300, position: 'fixed', height: '100%' }
                    : { width: collapsed ? 72 : 260, x: 0, position: 'sticky' }
            }
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`
                h-screen bg-slate-900 text-slate-400 flex flex-col justify-between z-50 border-r border-slate-800
                lg:sticky lg:top-0 fixed top-0 left-0
                ${mobileMenuOpen ? 'w-[260px]' : ''}
            `}
        >
            {/* Header / Logo */}
            <div className="p-5 flex items-center justify-between h-16 border-b border-slate-800/50">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <Building2 size={16} strokeWidth={2.5} />
                    </div>
                    {(!collapsed || mobileMenuOpen) && (
                        <span className="font-bold text-base text-white truncate tracking-tight">
                            {businessName}
                        </span>
                    )}
                </div>

                {/* Only show collapse toggle on Desktop */}
                <button
                    onClick={toggleSidebar}
                    className={`
                        p-1 rounded-md text-slate-500 hover:text-white transition-colors hidden lg:block
                        ${collapsed ? 'mx-auto' : ''}
                    `}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                {/* Close button for Mobile */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-md text-slate-500 hover:text-white transition-colors lg:hidden"
                >
                    <ChevronLeft size={18} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-0.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={({ isActive }) => `
                            flex items-center px-3 py-2.5 rounded-lg transition-colors duration-150 group relative
                            ${isActive
                                ? 'bg-indigo-600/10 text-indigo-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`flex items-center justify-center ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                    <item.icon size={20} strokeWidth={2} />
                                </div>

                                {(!collapsed || mobileMenuOpen) && (
                                    <span className="ml-3 font-medium text-sm">
                                        {item.label}
                                    </span>
                                )}

                                {/* Collapsed Tooltip (Desktop Only) */}
                                {collapsed && !mobileMenuOpen && (
                                    <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                                        {item.label}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-3 border-t border-slate-800/50">
                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center rounded-lg transition-colors duration-150 group w-full text-slate-400 hover:text-white hover:bg-slate-800
                        ${collapsed && !mobileMenuOpen ? 'justify-center p-2' : 'px-3 py-2'}
                    `}
                >
                    <LogOut size={18} />
                    {(!collapsed || mobileMenuOpen) && (
                        <span className="ml-3 text-sm font-medium">Log Out</span>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
