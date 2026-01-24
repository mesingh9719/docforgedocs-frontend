import React from 'react';

const DashboardPageHeader = ({ title, subtitle, children }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>
                )}
            </div>
            <div className="flex items-center gap-3">
                {children}
            </div>
        </div>
    );
};

export default DashboardPageHeader;
