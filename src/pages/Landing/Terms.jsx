import React from 'react';
import SEO from '../../components/SEO';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-32">
            <SEO
                title="Terms of Service - DocForge User Agreement"
                description="Read DocForge's terms of service to understand the agreement, use license, and disclaimers for using our document management platform."
                keywords="terms of service, user agreement, terms and conditions, legal terms"
                url="/terms"
                robots="noindex, follow"
            />
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">Last updated: January 1, 2026</p>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Agreement to Terms</h2>
                <p className="text-slate-600 mb-4">
                    By accessing or using our website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Use License</h2>
                <p className="text-slate-600 mb-4">
                    Permission is granted to temporarily download one copy of the materials (information or software) on DocForge's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Disclaimer</h2>
                <p className="text-slate-600 mb-4">
                    The materials on DocForge's website are provided on an 'as is' basis. DocForge makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
            </div>
        </div>
    );
};

export default Terms;
