import React, { useState, useMemo } from 'react';
import {
    Braces,
    Search,
    X,
    Check,
    Copy,
    Building2,
    User,
    FileText,
    Receipt,
    Sparkles,
    Shield,
    Briefcase,
    Layers,
    Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getNamespaces, getAllVariables } from '../../../utils/variableRegistry';

const CATEGORY_ICONS = {
    company: Building2,
    client: User,
    document: FileText,
    invoice: Receipt,
    proposal: Sparkles,
    offer: Briefcase,
    nda: Shield,
    custom: Layers,
    general: Braces,
};

const VariablePicker = ({
    isOpen,
    onClose,
    onSelectVariable,
    customVariables = {},
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [copiedKey, setCopiedKey] = useState(null);

    const namespaces = useMemo(() => {
        const base = [{ id: 'all', label: 'All Categories' }, ...getNamespaces()];
        if (Object.keys(customVariables).length > 0) {
            base.push({ id: 'custom', label: 'Custom Template Variables' });
        }
        return base;
    }, [customVariables]);

    const allVariablesList = useMemo(() => {
        return Object.values(getAllVariables(customVariables));
    }, [customVariables]);

    const filteredVariables = useMemo(() => {
        return allVariablesList.filter((item) => {
            const matchesCategory =
                selectedCategory === 'all' || item.category === selectedCategory || item.namespace === selectedCategory;
            const matchesSearch =
                !searchQuery ||
                item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [allVariablesList, selectedCategory, searchQuery]);

    const handleCopy = (key, e) => {
        e.stopPropagation();
        const tag = `{{${key}}}`;
        navigator.clipboard.writeText(tag);
        setCopiedKey(key);
        toast.success(`Copied ${tag} to clipboard!`);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleSelect = (key) => {
        const tag = `{{${key}}}`;
        if (onSelectVariable) {
            onSelectVariable(tag, key);
        }
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn font-sans">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden my-auto">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Braces size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Insert Dynamic Variable</h3>
                            <p className="text-xs text-slate-500">
                                Select a variable to insert dynamic business or customer data automatically.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search Bar & Category Filter */}
                <div className="p-4 border-b border-slate-100 bg-white space-y-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search variables by key, name, or description..."
                            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                        {namespaces.map((ns) => (
                            <button
                                key={ns.id}
                                type="button"
                                onClick={() => setSelectedCategory(ns.id)}
                                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                                    selectedCategory === ns.id
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                                }`}
                            >
                                {ns.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Variables List */}
                <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
                    {filteredVariables.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p className="text-xs font-semibold text-slate-600 mb-1">No variables found</p>
                            <p className="text-[11px]">Try adjusting your search keywords or filter category.</p>
                        </div>
                    ) : (
                        filteredVariables.map((v) => {
                            const IconComponent = CATEGORY_ICONS[v.category] || Braces;
                            const isCopied = copiedKey === v.key;

                            return (
                                <div
                                    key={v.key}
                                    onClick={() => handleSelect(v.key)}
                                    className="py-3 px-3 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-4 cursor-pointer group transition"
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="p-2 bg-slate-100 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 rounded-lg transition-colors shrink-0 mt-0.5">
                                            <IconComponent size={15} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">
                                                    {`{{${v.key}}}`}
                                                </span>
                                                <span className="text-xs font-semibold text-slate-800">{v.label}</span>
                                            </div>

                                            {v.sampleValue && (
                                                <p className="text-[11px] text-slate-500 truncate">
                                                    Sample:{' '}
                                                    <span className="text-slate-700 font-medium">{String(v.sampleValue)}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => handleCopy(v.key, e)}
                                            title="Copy tag"
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                        >
                                            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleSelect(v.key)}
                                            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition"
                                        >
                                            Insert
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Guide */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Tip: You can also type variables directly into any text block as <code>{'{{variable.name}}'}</code>.</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-600 hover:text-slate-900 font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariablePicker;
