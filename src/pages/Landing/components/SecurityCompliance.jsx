import React from 'react';
import { ShieldCheck, Lock, FileCheck, Award, KeyRound, CheckCircle } from 'lucide-react';

const complianceItems = [
    {
        icon: ShieldCheck,
        title: 'ESIGN Act & UETA',
        desc: 'Meets all statutory criteria for legally enforceable digital signatures in the United States and global common-law jurisdictions.'
    },
    {
        icon: Award,
        title: 'eIDAS Standard Compliant',
        desc: 'Complies with European Union Regulation (EU) No 910/2014 for cross-border electronic identification and trust services.'
    },
    {
        icon: Lock,
        title: '256-Bit End-to-End Encryption',
        desc: 'All documents, tokens, and confidential fields are encrypted in-transit with TLS 1.3 and at rest with AES-256.'
    },
    {
        icon: KeyRound,
        title: 'Tamper-Evident SHA-256 Hashes',
        desc: 'Any post-signature alteration invalidates the cryptographic verification checksum, guaranteeing document integrity.'
    },
    {
        icon: FileCheck,
        title: 'Comprehensive Audit Logs',
        desc: 'Tracks every document view, IP address, user agent, signer signature timestamp, and completion status.'
    },
    {
        icon: CheckCircle,
        title: 'GDPR & Data Privacy',
        desc: 'Zero unauthorized third-party tracking. You retain 100% intellectual property ownership of your uploaded materials.'
    }
];

const SecurityCompliance = () => {
    return (
        <section id="security-trust" className="py-20 bg-slate-900 text-white relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-grid-dark opacity-40 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                        <Lock size={14} className="text-indigo-400" /> Enterprise-Grade Trust
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                        Bank-Grade Security & <span className="text-indigo-400">Legal Compliance</span>
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                        Every contract forged on DocForge is backed by industry-standard encryption, regulatory compliance, and verifiable tamper-proof certificates.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {complianceItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="p-7 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SecurityCompliance;
