import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Send, Mail, MessageSquare, ShieldCheck, Clock, CheckCircle2, Sparkles, PhoneCall, Building2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import SEO from '../../components/SEO';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            setLoading(false);
            return;
        }

        try {
            const token = await executeRecaptcha('contact_submit');
            await api.post('/public/contact', { ...formData, recaptcha_token: token });
            setSubmitted(true);
            toast.success('Message sent successfully! Our team will respond shortly.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Failed to submit contact form", error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Contact Support & Sales | DocForge"
                description="Get in touch with the DocForge team. Fast support for agencies, freelancers, enterprise inquiries, and partnership requests."
                keywords="Contact DocForge, legal tech support, agency sales inquiry, customer service"
            />

            {/* Ambient Background Spotlights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-indigo-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <MessageSquare size={14} className="text-indigo-600" /> Fast Human Support
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                        We're Here to Help Your <br />
                        <span className="shimmer-text">Business Forge Ahead</span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Have questions about features, enterprise plans, or custom integration requests? Our team typically responds in under 2 hours.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
                    {/* Left Column: Support Channels & Guarantees */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">
                            <h2 className="text-2xl font-black text-slate-900">Direct Channels</h2>

                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase text-slate-400">Email Support</div>
                                    <div className="text-base font-bold text-slate-900">support@docforge.com</div>
                                    <p className="text-xs text-slate-500 mt-0.5">24/7 ticket response queue</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase text-slate-400">Enterprise Inquiries</div>
                                    <div className="text-base font-bold text-slate-900">sales@docforge.com</div>
                                    <p className="text-xs text-slate-500 mt-0.5">Custom volume & MSA contracts</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase text-slate-400">Response SLA</div>
                                    <div className="text-base font-bold text-slate-900">&lt; 2 Hours Average</div>
                                    <p className="text-xs text-slate-500 mt-0.5">Monday through Friday (Global Coverage)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-4">
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck size={16} /> Privacy & Compliance Assured
                            </div>
                            <h3 className="text-xl font-bold">Encrypted & Confidential</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                All customer correspondence is encrypted via TLS 1.3. We will never share or sell your contact information.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Modern Contact Form */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-2xl shadow-slate-200/50">
                        {submitted ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-900 py-16">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={36} />
                                </div>
                                <h3 className="text-2xl font-black mb-2">Message Dispatched!</h3>
                                <p className="text-sm text-emerald-700 max-w-md mx-auto mb-6">
                                    Thank you for reaching out. A DocForge specialist has received your inquiry and will respond within 2 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all cursor-pointer"
                                >
                                    Send Another Note
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Jane Doe"
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                                            Work Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="jane@company.com"
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Question about agency plans or enterprise features..."
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                                        Message Details
                                    </label>
                                    <textarea
                                        rows="5"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="How can we assist your workflow today?"
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                                    ></textarea>
                                </div>

                                <div className="text-[11px] text-slate-400 text-center leading-relaxed">
                                    Protected by Google reCAPTCHA Enterprise • <a href="/privacy" className="text-indigo-600 hover:underline">Privacy</a> &amp; <a href="/terms" className="text-indigo-600 hover:underline">Terms</a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-slate-900/15 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer group"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                            <span>Send Direct Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
