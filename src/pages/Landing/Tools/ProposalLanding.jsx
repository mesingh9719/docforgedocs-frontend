import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Users, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';

const ProposalLanding = () => {
    return (
        <div className="bg-white">
            <SEO
                title="Free Business Proposal Template & Generator"
                description="Create winning business proposals with our free professional template. Customize, download, and send proposals that convert. No signup required."
                keywords="business proposal template, free proposal generator, project proposal, sales proposal, freelance proposal, create proposal online"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6 border border-amber-200">
                            <Star size={14} className="fill-amber-500 text-amber-500" /> Premium Template
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Winning Proposals</span> <br />
                            That Close Deals
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Stop wrestling with Word documents. Use our professional proposal builder to create stunning, persuasive proposals in minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/create-document/proposal"
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                            >
                                <FileText size={20} />
                                Create Business Proposal
                            </Link>
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300 flex items-center justify-center gap-2"
                            >
                                Sign Up Free
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why use our Proposal Builder?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Standardize your sales process and impress clients with professionally structured documents.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: TrendingUp,
                                title: "Increase Conversion",
                                description: "Clear, structured proposals help clients understand value instantly, leading to higher acceptance rates."
                            },
                            {
                                icon: FileText,
                                title: "Professional Formatting",
                                description: "Forget about alignment issues. Our editor ensures your document looks perfect on any device."
                            },
                            {
                                icon: Users,
                                title: "Client-Centric",
                                description: "Templates designed to focus on your client's needs, proposed solutions, and clear pricing."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Content */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="prose prose-lg prose-indigo text-slate-600 mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">The Elements of a Perfect Business Proposal</h2>
                        <p>
                            A business proposal is more than just a price quote. It's a strategic document that outlines how your company can solve a specific problem for a client. To be effective, every proposal should include:
                        </p>
                        <ol className="list-decimal pl-6 space-y-4 mb-8">
                            <li>
                                <strong>Executive Summary:</strong> A high-level overview of the client's problem and your proposed solution. This is often the most read section.
                            </li>
                            <li>
                                <strong>Problem Statement:</strong> Demonstrate that you clearly understand the client's pain points and requirements.
                            </li>
                            <li>
                                <strong>Proposed Solution:</strong> Detail your approach, methodology, and deliverables. Be specific about what you will provide.
                            </li>
                            <li>
                                <strong>Pricing & Timeline:</strong> Clear, transparent costs and a realistic schedule for project completion.
                            </li>
                        </ol>
                        <p>
                            DocForge's proposal generator provides pre-built sections for all of these elements, allowing you to focus on the content rather than the layout.
                        </p>
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link
                            to="/create-document/proposal"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Start Your Proposal <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProposalLanding;
