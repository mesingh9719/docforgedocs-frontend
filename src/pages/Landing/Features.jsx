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
                title="Features"
                description="Explore DocForge features: Secure NDAs, Winning Proposals, Instant Invoicing, and Team Collaboration."
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
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
                            >
                                <div className="aspect-video bg-slate-200 flex items-center justify-center text-slate-400">
                                    {/* Placeholder for Editor Screenshot */}
                                    <span className="font-medium">Editor Interface Preview</span>
                                </div>
                            </motion.div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Unrivaled Editing Experience</h2>
                            <p className="text-slate-600 mb-8 text-lg">
                                Our purpose-built editors make customization intuitive. Forget complex formatting battles—just fill, click, and generate.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Real-time preview updates",
                                    "New! Version History & Restoration",
                                    "New! Share Tracking & Analytics",
                                    "One-click PDF export"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle className="text-indigo-500" size={20} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
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
