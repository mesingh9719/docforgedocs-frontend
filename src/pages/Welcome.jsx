import React, { Suspense } from 'react';
import SEO from '../components/SEO';
import HeroSection from './Landing/components/HeroSection';

// Lazy load non-critical sections for fast initial load
const LogoMarquee = React.lazy(() => import('./Landing/components/LogoMarquee'));
const TemplatesGrid = React.lazy(() => import('./Landing/components/TemplatesGrid'));
const DocumentPlayground = React.lazy(() => import('./Landing/components/DocumentPlayground'));
const FeatureShowcase = React.lazy(() => import('./Landing/components/FeatureShowcase'));
const SignaturePadDemo = React.lazy(() => import('./Landing/components/SignaturePadDemo'));
const RoiCalculator = React.lazy(() => import('./Landing/components/RoiCalculator'));
const TestimonialsSection = React.lazy(() => import('./Landing/components/TestimonialsSection'));
const SecurityCompliance = React.lazy(() => import('./Landing/components/SecurityCompliance'));
const FAQSection = React.lazy(() => import('./Landing/components/FAQSection'));
const FinalCTA = React.lazy(() => import('./Landing/components/FinalCTA'));

// Sleek loading fallback
const SectionLoader = () => (
    <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
);

const Welcome = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-600 selection:text-white overflow-x-hidden">
            <SEO
                title="DocForge - Modern Document & Legally Enforceable eSignature OS"
                description="The operating system for modern agencies and freelancers. Generate professional NDAs, Proposals, and Invoices with legally binding eSignatures. 100% free to start."
                keywords="Free NDA Generator, Business Proposal Creator, Consulting Agreement Template, Electronic Signatures, Online Legal Documents, Agency Operating System"
            />

            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px] -translate-x-1/4" />
                <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-purple-100/30 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-50" />
            </div>

            <main className="relative z-10 pt-28 sm:pt-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <HeroSection />
                </div>

                <Suspense fallback={<div className="h-20" />}>
                    <LogoMarquee />
                </Suspense>

                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Suspense fallback={<SectionLoader />}>
                        <TemplatesGrid />
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <DocumentPlayground />
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <FeatureShowcase />
                    </Suspense>
                </div>

                <Suspense fallback={<SectionLoader />}>
                    <SignaturePadDemo />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <RoiCalculator />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <TestimonialsSection />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <SecurityCompliance />
                </Suspense>

                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Suspense fallback={<SectionLoader />}>
                        <FAQSection />
                    </Suspense>

                    <Suspense fallback={<SectionLoader />}>
                        <FinalCTA />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default Welcome;