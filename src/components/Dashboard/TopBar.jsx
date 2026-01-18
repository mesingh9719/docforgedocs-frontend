import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const TopBar = ({ business, user, onMenuClick }) => {
    return (
        <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-all duration-300">
            {/* Breadcrumbs / Page Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">
                        Overview of your {business?.name || 'Workspace'}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64 focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 text-slate-700 hover:border-slate-300"
                    />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

                {/* Notifications */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                >
                    <Bell size={18} />
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                </motion.button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-700 leading-tight">Admin User</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Owner</p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="h-9 w-9 rounded-lg bg-slate-100 cursor-pointer border border-slate-200 flex items-center justify-center text-slate-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                        <User size={18} />
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
