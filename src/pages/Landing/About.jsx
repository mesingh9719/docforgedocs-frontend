import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award } from 'lucide-react';
import SEO from '../../components/SEO';

const About = () => {
    return (
        <div className="bg-white">
            <SEO
                title="About Us"
                description="Empowering businesses to forge ahead. Learn more about DocForge's mission and team."
            />
            {/* Hero */}
            <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-slate-900 mb-8"
                >
                    Empowering businesses to <span className="text-indigo-600">forge ahead.</span>
                </motion.h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    At DocForge, we believe that administrative friction shouldn't slow down innovation.
                    Our mission is to provide intuitive, powerful tools that let you focus on what you do best—building your business.
                </p>
            </section>

            {/* Stats */}
            <section className="py-12 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <div className="text-4xl font-bold text-indigo-400 mb-2">10k+</div>
                        <div className="text-slate-400">Documents Generated</div>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl font-bold text-indigo-400 mb-2">99.9%</div>
                        <div className="text-slate-400">Uptime Reliability</div>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl font-bold text-indigo-400 mb-2">24/7</div>
                        <div className="text-slate-400">Global Support</div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 px-6 max-w-5xl mx-auto">
                <div className="bg-slate-50 p-8 md:p-12 rounded-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Founded in 2024, DocForge started with a simple observation: small businesses and freelancers were wasting hours on paperwork that should take minutes. Clunky legacy software and expensive legal fees were barriers to entry.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        We built DocForge to be the solution we wanted for ourselves—fast, beautiful, and secure. Today, we're proud to support a growing community of entrepreneurs and teams worldwide.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Customer First</h3>
                        <p className="text-slate-500">We build for you. Your feedback drives our roadmap and our innovations.</p>
                    </div>
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Globe size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Global Mindset</h3>
                        <p className="text-slate-500">Business knows no borders. Our tools are designed for international collaboration.</p>
                    </div>
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Excellence</h3>
                        <p className="text-slate-500">We don't settle for "good enough". We strive for perfection in every pixel.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
