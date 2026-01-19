import React from 'react';

const Changelog = () => {
    const changes = [
        {
            version: "v1.0.0",
            date: "January 19, 2026",
            title: "Global Launch",
            description: "DocForge is officially live! Create NDAs, Proposals, and Invoices with ease.",
            type: "Major"
        },
        {
            version: "v0.9.5",
            date: "December 15, 2025",
            title: "Beta Release",
            description: "Initial beta release to select partners.",
            type: "Beta"
        }
    ];

    return (
        <div className="max-w-3xl mx-auto px-6 py-32">
            <h1 className="text-4xl font-bold text-slate-900 mb-12">Product Updates</h1>

            <div className="space-y-12 border-l border-slate-200 ml-4 pl-8 relative">
                {changes.map((change, index) => (
                    <div key={index} className="relative">
                        <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-indigo-600"></div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{change.version}</span>
                            <span className="text-slate-400 text-sm">{change.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{change.title}</h3>
                        <p className="text-slate-600">{change.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Changelog;
