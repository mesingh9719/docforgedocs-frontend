import React from 'react';
import {
    HardDrive,
    Clock,
    Star,
    Trash2,
    Cloud,
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const DriveSidebar = ({ currentView, onViewChange, onUploadClick, onCreateFolderClick, storageUsed = 75 }) => {
    const navItems = [
        { id: 'root', icon: HardDrive, label: 'My Files' },
        { id: 'recent', icon: Clock, label: 'Recent' },
        { id: 'favorites', icon: Star, label: 'Favorites' },
        { id: 'trash', icon: Trash2, label: 'Trash' },
    ];

    return (
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full flex-shrink-0">
            <div className="p-4">
                <button
                    onClick={onUploadClick}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus size={20} />
                    <span>New Upload</span>
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                            ${currentView === item.id
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                    >
                        <item.icon size={20} className={currentView === item.id ? 'text-indigo-600' : 'text-slate-400'} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Storage Widget */}
            <div className="p-4 mt-auto border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium text-sm">
                    <Cloud size={16} className="text-indigo-500" />
                    <span>Storage</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${storageUsed}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                </div>
                <p className="text-xs text-slate-500 flex justify-between">
                    <span>{storageUsed}% used</span>
                    <span>100 GB total</span>
                </p>
            </div>
        </div>
    );
};

export default DriveSidebar;
