import React from 'react';

const DocumentSkeleton = ({ viewMode }) => {
    if (viewMode === 'list') {
        return (
            <div className="flex items-center gap-6 py-4 px-6 border-b border-slate-100 last:border-0 animate-pulse">
                {/* Checkbox */}
                <div className="w-5 h-5 bg-slate-100 rounded"></div>

                {/* Icon */}
                <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>

                {/* Content */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="hidden md:block h-4 bg-slate-100 rounded w-1/2"></div>
                    <div className="hidden md:block h-4 bg-slate-100 rounded w-1/3"></div>
                    <div className="hidden md:block h-4 bg-slate-100 rounded w-1/2"></div>
                </div>

                {/* Actions */}
                <div className="w-8 h-8 bg-slate-100 rounded ml-auto"></div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse flex flex-col h-[280px]">
            <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
            </div>

            <div className="space-y-3 flex-1">
                <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-50 rounded w-1/2"></div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100"></div>
                    <div className="w-20 h-3 bg-slate-100 rounded"></div>
                </div>
                <div className="w-16 h-3 bg-slate-100 rounded"></div>
            </div>
        </div>
    );
};

export default DocumentSkeleton;
