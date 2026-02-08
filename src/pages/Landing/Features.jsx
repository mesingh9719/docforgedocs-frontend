import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Users, Zap, Briefcase, Layout, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

const Features = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const features = [
        {
            icon: Shield,
            title: "Secure NDAs",
            description: "Generate rock-solid Non-Disclosure Agreements in seconds. Protect your intellectual property with legally sound templates."
        },
        {
            icon: FileText,
            title: "Winning Proposals",
            description: "Create stunning business proposals that convert. Customize every detail to match your brand and impress clients."
        },
        {
            icon: Zap,
            title: "Instant Invoicing",
            description: "Get paid faster with professional invoices. Automated calculations, tax handling, and sleek designs."
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Invite your team, assign roles, and collaborate on documents in real-time. Streamline your workflow."
        },
        {
            icon: Layout,
            title: "Custom Branding",
            description: "Your docs, your brand. Upload logos, set colors, and ensure every document reflects your company identity."
        },
        {
            icon: Briefcase,
            title: "Client Management",
            description: "Keep track of client details and associate documents with specific projects easily."
        }
    ];

    return (
        <div className="bg-white">
            <SEO
                title="Features - Document Management & Collaboration Tools"
                description="Explore DocForge features: Secure NDA generation, winning business proposals, instant invoicing, team collaboration, custom branding, and client management tools for modern agencies."
                keywords="Document management features, NDA generator, proposal creator, invoice software, team collaboration, custom branding, client management"
                url="/features"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 -skew-y-3 origin-top-left z-0 transform -translate-y-20"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
                    >
                        Tools designed for <span className="text-indigo-600">running your agency.</span>
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        DocForge isn't just a document editor. It's a complete operating system for your paperwork. From proposal to payment, we've got you covered.
                    </motion.p>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="p-8 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-xl transition-all group"
                            >
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Deep Dive Section */}
            <section className="py-24 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Image Side */}
                        <div className="flex-1 w-full relative">
                            {/* Decorative Background Blob */}
                            <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="relative z-10 rounded-2xl shadow-2xl bg-white p-2 border border-slate-100"
                            >
                                <img
                                    src="/images/dashboard-preview.png"
                                    alt="DocForge document editor interface with real-time preview, version history, and one-click PDF export"
                                    className="w-full h-auto rounded-xl border border-slate-200/50"
                                />
                                {/* Optional: Add a subtle reflection or overlay if desired, but clean is better for 'premium' */}
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none"></div>
                            </motion.div>
                        </div>

                        {/* Text Side */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
                                    <Zap size={16} /> Power & Simplicity
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                    Unrivaled Editing Experience
                                </h2>
                                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                                    Our purpose-built editors make customization intuitive. Forget complex formatting battles—just fill, click, and generate documents that look professionally designed every time.
                                </p>

                                <ul className="space-y-4">
                                    {[
                                        "Real-time preview updates",
                                        "Version History & Restoration",
                                        "Share Tracking & Analytics",
                                        "One-click PDF export"
                                    ].map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className="flex items-center gap-3 text-slate-700 font-medium"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                <CheckCircle size={14} strokeWidth={3} />
                                            </div>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>

                                <div className="mt-10">
                                    <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-2 group">
                                        Experience the editor <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to streamline your workflow?</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of freelancers and agencies who rely on DocForge for their critical documentation.
                    </p>
                    <Link to="/register" className="inline-block px-8 py-4 bg-indigo-600 rounded-xl text-lg font-bold hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-indigo-500/25">
                        Get Started for Free
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Features;
