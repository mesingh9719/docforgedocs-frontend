import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { testimonials } from '../data/landing-data';

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="py-24 bg-white relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Star size={14} className="fill-amber-500 text-amber-500" /> Rated 4.9/5 by Agency Founders
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Built for Fast-Moving Teams Who <span className="shimmer-text">Value Speed</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Read how modern agencies, consultants, and tech founders closed bigger deals faster with DocForge.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, duration: 0.5 }}
                            whileHover={{ y: -6 }}
                            className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between relative group hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300"
                        >
                            <div className="absolute top-6 right-6 text-slate-200 group-hover:text-indigo-100 transition-colors pointer-events-none">
                                <Quote size={40} />
                            </div>

                            <div>
                                <div className="flex items-center gap-1 text-amber-400 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6 font-medium">
                                    "{testimonial.text}"
                                </p>
                            </div>

                            <div>
                                <div className="p-3 bg-white group-hover:bg-indigo-50/60 rounded-xl border border-slate-200/60 group-hover:border-indigo-100 mb-6 transition-colors">
                                    <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1.5">
                                        <CheckCircle2 size={13} />
                                        <span>Key Outcome: {testimonial.metric}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                                        loading="lazy"
                                    />
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">{testimonial.name}</h3>
                                        <p className="text-xs text-slate-500">{testimonial.role}, {testimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
