import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Zap, Building2, Star, CheckCircle2, ChevronDown, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';

const pricingPlans = [
    {
        id: 'starter',
        name: 'Starter',
        tagline: 'For freelancers & solo creators just getting started.',
        monthlyPrice: 0,
        annualPrice: 0,
        periodLabel: 'Free Forever',
        popular: false,
        badge: 'No Credit Card',
        buttonText: 'Start Drafting Free',
        buttonLink: '/register?plan=starter',
        buttonStyle: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
        features: [
            'Unlimited document drafting & customization',
            'Full access to standard templates (NDA, Proposals, Invoices)',
            'Instant high-resolution vector PDF export',
            '3 electronic signature requests / month',
            'Standard SHA-256 cryptographic audit logs',
            'Mobile touch signing pad for recipients'
        ]
    },
    {
        id: 'pro',
        name: 'Professional',
        tagline: 'For active freelancers & small boutique agencies.',
        monthlyPrice: 19,
        annualPrice: 15,
        periodLabel: 'per user / month',
        popular: true,
        badge: 'Most Popular',
        buttonText: 'Start 14-Day Free Pro Trial',
        buttonLink: '/register?plan=pro',
        buttonStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/25',
        features: [
            'Everything in Starter, plus:',
            'Unlimited electronic signature requests & envelopes',
            'Custom branding: your agency logo, fonts, & colors',
            'Real-time document open & viewing alert notifications',
            'Document version history & 1-click restore',
            'Expiring access links with token security',
            'Unlimited cloud document storage & search'
        ]
    },
    {
        id: 'agency',
        name: 'Agency & Teams',
        tagline: 'For expanding teams, studios, and fast-growing agencies.',
        monthlyPrice: 49,
        annualPrice: 39,
        periodLabel: 'per team / month (5 seats)',
        popular: false,
        badge: 'Maximum Value',
        buttonText: 'Get Started with Team',
        buttonLink: '/register?plan=agency',
        buttonStyle: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/15',
        features: [
            'Everything in Professional, plus:',
            'Includes 5 team member seats (add more for $9/mo)',
            'Shared agency template library for team standardization',
            'Granular workspace role permissions (Owner, Admin, Editor)',
            'Dedicated client signature portals',
            'White-label email delivery headers',
            'Priority 24/7 support & dedicated account onboarding'
        ]
    }
];

const comparisonMatrix = [
    {
        category: 'Document Creation & Templates',
        items: [
            { name: 'Standard Templates (NDA, Proposals, Invoices, Contracts)', starter: 'Unlimited', pro: 'Unlimited', agency: 'Unlimited' },
            { name: 'Instant Vector PDF Download', starter: true, pro: true, agency: true },
            { name: 'Free Starter Tier (No Credit Card Required)', starter: true, pro: true, agency: true },
            { name: 'Custom Agency Templates & Saved Defaults', starter: false, pro: 'Up to 10', agency: 'Unlimited' },
            { name: 'Version History & Diff Tracking', starter: false, pro: '30 Days', agency: 'Unlimited' }
        ]
    },
    {
        category: 'eSignatures & Legal Security',
        items: [
            { name: 'Monthly Signature Envelopes', starter: '3 / month', pro: 'Unlimited', agency: 'Unlimited' },
            { name: 'ESIGN & eIDAS Regulatory Compliance', starter: true, pro: true, agency: true },
            { name: 'Cryptographic SHA-256 Audit Certificate', starter: true, pro: true, agency: true },
            { name: 'Multi-party Signer Routing Sequence', starter: false, pro: true, agency: true },
            { name: 'Automated Signer Reminders', starter: false, pro: true, agency: true }
        ]
    },
    {
        category: 'Branding & Tracking',
        items: [
            { name: 'Real-Time Open & View Tracking', starter: false, pro: true, agency: true },
            { name: 'Custom Logo & Color Palette Embedding', starter: false, pro: true, agency: true },
            { name: 'White-Label Email Sender Header', starter: false, pro: false, agency: true },
            { name: 'Expiring Link & Passcode Protection', starter: false, pro: true, agency: true }
        ]
    },
    {
        category: 'Team & Support',
        items: [
            { name: 'Team Member Seats Included', starter: '1 User', pro: '1 User', agency: '5 Users included' },
            { name: 'Granular Role Permissions', starter: false, pro: false, agency: true },
            { name: 'Support SLA', starter: 'Community', pro: 'Standard (12h)', agency: 'Priority 24/7 (1h)' }
        ]
    }
];

const pricingFaqs = [
    {
        q: "Can I use DocForge completely free without a credit card?",
        a: "Yes! Our Starter plan is 100% free forever. You can create a free account, draft documents, download PDFs, and send up to 3 eSignatures per month with no credit card required."
    },
    {
        q: "How does the 14-day Pro trial work?",
        a: "When you sign up for Pro, you get 14 days of unrestricted access to unlimited eSignatures, custom branding, and real-time open alerts. You can cancel anytime with one click."
    },
    {
        q: "Are the digital signatures legally binding in court?",
        a: "Yes. All DocForge signatures are fully compliant with the US Federal ESIGN Act, UETA, and European eIDAS regulations. Each signed document includes an immutable audit log with cryptographic SHA-256 hashes."
    },
    {
        q: "Can I add more team members to the Agency plan?",
        a: "Yes. The Agency plan comes with 5 seats included, and you can add extra seats at any time for just $9/month per user."
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and ACH wire transfers for annual enterprise plans."
    }
];

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Simple, Transparent Pricing | DocForge"
                description="Choose the right DocForge plan for your agency or freelance business. Free forever starter plan, plus scalable Pro and Team tiers."
                keywords="DocForge Pricing, Free eSignature software, Document generator pricing, Agency contract tool pricing"
            />

            {/* Ambient Background Spotlights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-indigo-100/50 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={14} className="text-indigo-600" /> Transparent Value Guarantee
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                        Predictable Plans. <br />
                        <span className="shimmer-text">No Hidden Envelope Fees.</span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Replace expensive separate subscriptions for document generators, DocuSign, and template software with one unified system.
                    </p>

                    {/* Monthly / Annual Billing Switcher */}
                    <div className="mt-10 inline-flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                !isAnnual ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Monthly Billing
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                isAnnual ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <span>Annual Billing</span>
                            <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full animate-pulse">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* 3 Tier Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24 items-stretch">
                    {pricingPlans.map((plan) => {
                        const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.3 }}
                                className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                                    plan.popular
                                        ? 'bg-white border-2 border-indigo-600 shadow-2xl shadow-indigo-500/15 ring-4 ring-indigo-500/10'
                                        : 'bg-white/90 border border-slate-200 shadow-xl shadow-slate-200/40'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                                        <Star size={12} className="fill-white" /> {plan.badge}
                                    </div>
                                )}

                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                                            <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">{plan.tagline}</p>
                                        </div>
                                    </div>

                                    {/* Pricing display */}
                                    <div className="my-6 pb-6 border-b border-slate-100">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl md:text-5xl font-black text-slate-900 font-mono">
                                                ${price}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500">
                                                {plan.id === 'starter' ? '' : '/ month'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 font-medium">
                                            {isAnnual && price > 0 ? 'Billed annually ($' + (price * 12) + '/year)' : plan.periodLabel}
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <div className="space-y-3.5 mb-8">
                                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                                            What's included:
                                        </div>
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3 text-xs md:text-sm text-slate-700">
                                                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                                                    <Check size={13} strokeWidth={3} />
                                                </div>
                                                <span className={i === 0 && plan.id !== 'starter' ? 'font-bold text-slate-900' : ''}>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(plan.buttonLink)}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${plan.buttonStyle}`}
                                >
                                    <span>{plan.buttonText}</span>
                                    <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Feature Comparison Table */}
                <div className="mb-24 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/40">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Full Feature Comparison
                        </h2>
                        <p className="text-sm md:text-base text-slate-500">
                            See how each plan stacks up side-by-side with complete transparency.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200 text-xs uppercase font-extrabold text-slate-400">
                                    <th className="pb-4 w-1/2">Capability</th>
                                    <th className="pb-4 text-center w-1/6">Starter</th>
                                    <th className="pb-4 text-center w-1/6 text-indigo-600 font-black">Professional</th>
                                    <th className="pb-4 text-center w-1/6">Agency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonMatrix.map((section, sIdx) => (
                                    <React.Fragment key={sIdx}>
                                        <tr className="bg-slate-50/80">
                                            <td colSpan="4" className="py-3 px-4 font-bold text-xs uppercase text-slate-700 tracking-wider">
                                                {section.category}
                                            </td>
                                        </tr>
                                        {section.items.map((row, rIdx) => (
                                            <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs md:text-sm">
                                                <td className="py-3.5 px-4 font-medium text-slate-800">{row.name}</td>
                                                <td className="py-3.5 px-2 text-center text-slate-600">
                                                    {typeof row.starter === 'boolean' ? (
                                                        row.starter ? <Check size={16} className="text-emerald-500 mx-auto" /> : <span className="text-slate-300">—</span>
                                                    ) : row.starter}
                                                </td>
                                                <td className="py-3.5 px-2 text-center font-bold text-indigo-700 bg-indigo-50/20">
                                                    {typeof row.pro === 'boolean' ? (
                                                        row.pro ? <Check size={16} className="text-indigo-600 mx-auto" /> : <span className="text-slate-300">—</span>
                                                    ) : row.pro}
                                                </td>
                                                <td className="py-3.5 px-2 text-center font-semibold text-slate-800">
                                                    {typeof row.agency === 'boolean' ? (
                                                        row.agency ? <Check size={16} className="text-emerald-500 mx-auto" /> : <span className="text-slate-300">—</span>
                                                    ) : row.agency}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pricing FAQ Section */}
                <div className="mb-24 max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 text-center mb-10 tracking-tight">
                        Pricing & Billing FAQs
                    </h2>
                    <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-4">
                        {pricingFaqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                                <h3 className="font-extrabold text-base text-slate-900 mb-2">{faq.q}</h3>
                                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Enterprise Banner */}
                <div className="p-8 md:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl">
                    <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 block mb-2">
                            Custom Enterprise Needs?
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black mb-2">
                            Custom Volume, SSO & Dedicated SLA
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                            Need tailored API access, SAML SSO, SOC-2 reports, or custom MSA contracts? Our enterprise team is ready to assist.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/contact')}
                        className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-sm whitespace-nowrap shadow-xl transition-all cursor-pointer"
                    >
                        Talk to Enterprise Sales
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Pricing;
