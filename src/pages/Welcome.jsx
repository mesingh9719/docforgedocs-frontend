import React, { Suspense } from 'react';
import SEO from '../components/SEO';
import HeroSection from './Landing/components/HeroSection';

// Lazy load non-critical sections
const SocialProof = React.lazy(() => import('./Landing/components/SocialProof'));
const TemplatesGrid = React.lazy(() => import('./Landing/components/TemplatesGrid'));
const FeatureShowcase = React.lazy(() => import('./Landing/components/FeatureShowcase'));
const DigitalSignatureUpsell = React.lazy(() => import('./Landing/components/DigitalSignatureUpsell'));
const FAQSection = React.lazy(() => import('./Landing/components/FAQSection'));
const FinalCTA = React.lazy(() => import('./Landing/components/FinalCTA'));

// Loading fallback
const SectionLoader = () => (
    <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
);

const Welcome = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <SEO
                title="DocForge - Free NDA & Proposal Generator"
                description="The operating system for modern agencies. Generate professional NDAs, Proposals, and Invoices for free. No signup required to start."
                keywords="Free NDA Generator, Business Proposal Creator, Consulting Agreement Template, Online Legal Documents, Agency Software"
            />

            {/* Background Effects - Optimized with simple CSS/SVG */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/4 will-change-transform" />
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] opacity-40 -translate-y-1/2 -translate-x-1/4 will-change-transform" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
                <HeroSection />

                <Suspense fallback={<div className="h-24"></div>}>
                    <SocialProof />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <TemplatesGrid />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <FeatureShowcase />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <DigitalSignatureUpsell />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <FAQSection />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <FinalCTA />
                </Suspense>
            </main>
        </div>
    );
};

export default Welcome;