import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { CheckCircle2 } from 'lucide-react';

export const SidebarSection = ({ title, icon: Icon, isOpen, isComplete, onClick, children }) => (
    <div className="border-b border-slate-100 last:border-none">
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-slate-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
        >
            <div className="flex items-center gap-3 font-semibold text-sm">
                {Icon && <Icon size={18} className={isOpen ? 'text-indigo-500' : (isComplete ? 'text-emerald-500' : 'text-slate-400')} />}
                <span>{title}</span>
            </div>
            <div className="flex items-center gap-2">
                {isComplete && <CheckCircle2 size={16} className="text-emerald-500" />}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} />
                </motion.div>
            </div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="p-4 pt-0 space-y-4">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export const SidebarInput = ({ label, name, value, onChange, placeholder, type = "text", rows, className = "" }) => (
    <div className={className}>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
        {rows ? (
            <textarea
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 resize-y"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400"
            />
        )}
    </div>
);
