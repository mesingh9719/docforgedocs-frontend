import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader, AlertCircle, Save } from 'lucide-react';

export const SettingsSection = ({ title, description, children, className = '' }) => (
    <div className={`p-0 md:p-0 ${className} mb-8`}>
        <div className="mb-5 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        <div className="space-y-5">
            {children}
        </div>
    </div>
);

export const SettingsInput = ({ label, error, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <div className="relative">
            <input
                className={`block w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm px-3.5 py-2.5 border transition-all duration-200 outline-none placeholder-slate-400 text-slate-900 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'hover:border-slate-400'}`}
                {...props}
            />
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
    </div>
);

export const SettingsSelect = ({ label, error, children, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <div className="relative">
            <select
                className={`block w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm px-3.5 py-2.5 border transition-all duration-200 outline-none appearance-none text-slate-900 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'hover:border-slate-400'}`}
                {...props}
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
    </div>
);

export const SettingsTextarea = ({ label, error, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <textarea
            className={`block w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm px-3.5 py-2.5 border transition-all duration-200 outline-none placeholder-slate-400 text-slate-900 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'hover:border-slate-400'}`}
            {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
    </div>
);

export const SaveButton = ({ loading, saved, onClick, disabled, label = "Save Changes" }) => (
    <div className="flex justify-end pt-6 border-t border-slate-200 mt-8">
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.99 }}
            type="submit"
            disabled={loading || disabled}
            onClick={onClick}
            className={`inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white transition-all duration-200 
                ${saved
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : disabled
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'} 
                disabled:opacity-70 disabled:cursor-not-allowed`}
        >
            {loading ? (
                <Loader className="animate-spin mr-2" size={16} strokeWidth={2.5} />
            ) : saved ? (
                <Check className="mr-2" size={16} strokeWidth={3} />
            ) : (
                <Save className="mr-2" size={16} strokeWidth={2.5} />
            )}
            {saved ? 'Changes Saved' : label}
        </motion.button>
    </div>
);

export const SuccessMessage = ({ message }) => (
    <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-3 text-emerald-700 text-sm font-medium bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-200 mb-6"
    >
        <Check size={16} strokeWidth={2.5} className="text-emerald-600" />
        {message}
    </motion.div>
);

export const ErrorMessage = ({ message }) => (
    <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-3 text-red-700 text-sm font-medium bg-red-50 px-4 py-3 rounded-lg border border-red-200 mb-6"
    >
        <AlertCircle size={16} strokeWidth={2.5} className="text-red-500" />
        {message}
    </motion.div>
);
