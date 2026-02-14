import React from 'react';

const SocialProof = () => {
    // Simple text logos for demo, can be replaced with SVGs
    const clients = ['Acme Corp', 'Nebula', 'GlobalBank', 'TechFlow', 'SaaS.io'];

    return (
        <div className="mb-32 text-center relative z-10 hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by modern teams</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                {clients.map(logo => (
                    <span key={logo} className="text-xl font-black text-slate-800 hover:text-indigo-900 cursor-default transition-colors">
                        {logo}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SocialProof;
