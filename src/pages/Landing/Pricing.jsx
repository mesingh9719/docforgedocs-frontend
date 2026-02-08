import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

const Pricing = () => {
    const [annual, setAnnual] = useState(true);

    const plans = [
        {
            name: "Starter",
            price: annual ? 0 : 0,
            description: "Perfect for freelancers just getting started.",
            features: [
                "Up to 3 Documents/mo",
                "Basic NDA Templates",
                "Standard PDF Export",
                "1 User Seat"
            ],
            cta: "Start Free",
            popular: false
        },
        {
            name: "Professional",
            price: annual ? 19 : 25,
            description: "For growing agencies and serious professionals.",
            features: [
                "Unlimited Documents",
                "All Template Types (NDA, Proposal, Invoice)",
                "Custom Branding & Logos",
                "Team Management (Up to 5 seats)",
                "Priority Support"
            ],
            cta: "Start Trial",
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Tailored solutions for large organizations.",
            features: [
                "Everything in Professional",
                "Unlimited Team Seats",
                "SSO & Advanced Security",
                "Custom Contract Development",
                "Dedicated Account Manager"
            ],
            cta: "Contact Sales",
            popular: false
        }
    ];

    // FAQ Schema for structured data
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Can I cancel anytime?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a free trial?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer a 14-day free trial for the Professional plan. No credit card required to start."
                }
            }
        ]
    };

    return (
        <div className="bg-white">
            <SEO
                title="Pricing - Affordable Plans for Freelancers & Agencies"
                description="Simple, transparent pricing for DocForge. Start free with basic features or upgrade to Professional for unlimited documents, custom branding, and team collaboration. Enterprise plans available."
                keywords="DocForge pricing, document management pricing, NDA generator cost, proposal software pricing, affordable business tools"
                url="/pricing"
                jsonLd={faqSchema}
            />

            {/* Header */}
            <section className="pt-32 pb-16 px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
                >
                    Simple, transparent pricing
                </motion.h1>
                <div className="flex items-center justify-center gap-4 mt-8">
                    <span className={`text-sm font-medium ${!annual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                    <button
                        onClick={() => setAnnual(!annual)}
                        className="w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors relative"
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-sm font-medium ${annual ? 'text-slate-900' : 'text-slate-500'}`}>
                        Yearly <span className="text-emerald-500 text-xs font-bold ml-1">(Save 20%)</span>
                    </span>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-200' : 'border-slate-200 shadow-sm'} bg-white`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                            <p className="text-slate-500 text-sm mt-2 h-10">{plan.description}</p>

                            <div className="my-8">
                                <span className="text-4xl font-bold text-slate-900">
                                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                                </span>
                                {typeof plan.price === 'number' && (
                                    <span className="text-slate-500">/mo</span>
                                )}
                            </div>

                            <Link
                                to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                                className={`block w-full py-3 rounded-xl font-bold text-center transition-all ${plan.popular
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                            >
                                {plan.cta}
                            </Link>

                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                        <Check size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="py-20 bg-slate-50 border-t border-slate-200">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-8 text-left">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Can I cancel anytime?</h4>
                            <p className="text-slate-600">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Is there a free trial?</h4>
                            <p className="text-slate-600">We offer a 14-day free trial for the Professional plan. No credit card required to start.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
