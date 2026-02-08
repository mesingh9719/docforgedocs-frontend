import React, { useState } from 'react';
import { Send } from 'lucide-react';
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/public/contact', formData);
            setSubmitted(true);
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Failed to submit contact form", error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white pt-32 pb-24">
            <SEO
                title="Contact Us - Get in Touch with Our Team"
                description="Have questions about DocForge? Contact our support team for help with document management, pricing, or technical support. We're here to help."
                keywords="contact DocForge, customer support, help, technical support, sales inquiry"
                url="/contact"
            />
            <div className="max-w-3xl mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Get in touch</h1>
                <p className="text-slate-600 text-lg mb-12">
                    Have questions about our plans or need technical support? We're here to help.
                </p>

                {submitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-emerald-800">
                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                        <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-6 text-emerald-600 font-medium hover:underline">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-xl text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                required
                                placeholder="How can we help?"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                            <textarea
                                rows="5"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                required
                                placeholder="Tell us more..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={20} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Contact;
