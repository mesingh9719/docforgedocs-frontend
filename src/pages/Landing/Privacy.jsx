import React from 'react';
import SEO from '../../components/SEO';

const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-32">
            <SEO
                title="Privacy Policy - How We Protect Your Data"
                description="Read DocForge's privacy policy to understand how we collect, use, and protect your personal data. Learn about your privacy rights and data security."
                keywords="privacy policy, data protection, GDPR, user privacy, data security"
                url="/privacy"
                robots="noindex, follow"
            />
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">Last updated: January 1, 2026</p>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Introduction</h2>
                <p className="text-slate-600 mb-4">
                    Welcome to DocForge. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Data We Collect</h2>
                <p className="text-slate-600 mb-4">
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. How We Use Your Data</h2>
                <p className="text-slate-600 mb-4">
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                </ul>
            </div>
        </div>
    );
};

export default Privacy;
