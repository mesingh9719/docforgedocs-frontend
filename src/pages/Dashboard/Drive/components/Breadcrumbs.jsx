import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items, onNavigate }) => {
    return (
        <nav className="flex items-center space-x-1 text-sm text-slate-500 overflow-x-auto scrollbar-none pb-2">
            <button
                onClick={() => onNavigate(null)}
                className={`flex items-center hover:text-indigo-600 transition-colors ${items.length === 0 ? 'font-semibold text-slate-800' : ''}`}
            >
                <Home size={16} />
                <span className="ml-1">Home</span>
            </button>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <React.Fragment key={item.id}>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                        <button
                            onClick={() => !isLast && onNavigate(item)}
                            disabled={isLast}
                            className={`whitespace-nowrap hover:text-indigo-600 transition-colors ${isLast ? 'font-semibold text-slate-800 cursor-default hover:text-slate-800' : ''}`}
                        >
                            {item.name}
                        </button>
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
