import { Shield, Zap, FileText, Receipt, PenTool, UserCheck, CheckCircle2, Star, Sparkles, Building2, Globe2, ShieldCheck, HeartHandshake } from 'lucide-react';

export const templateCategories = [
    { id: 'all', label: 'All Templates' },
    { id: 'legal', label: 'Legal & Protection' },
    { id: 'sales', label: 'Sales & Proposals' },
    { id: 'billing', label: 'Invoices & Billing' },
    { id: 'hr', label: 'Hiring & HR' },
    { id: 'signatures', label: 'eSignatures' }
];

export const templates = [
    {
        id: 'nda',
        title: 'Non-Disclosure Agreement',
        subtitle: 'Unilateral & Mutual IP Protection',
        category: 'legal',
        categoryLabel: 'Legal',
        description: 'Generate legally enforceable NDAs in under 2 minutes. Protect confidential business information, IP, trade secrets, and client data.',
        icon: Shield,
        color: 'text-emerald-600',
        gradient: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'Most Popular',
        timeEstimate: '2 mins',
        clausesCount: '12 standard clauses',
        clauses: ['Confidentiality Scope', 'Non-Circumvention', 'Term & Termination', 'Remedies & Injunction', 'Governing Jurisdiction'],
        rating: 4.9,
        reviewsCount: 1420
    },
    {
        id: 'proposal',
        title: 'Business Proposal',
        subtitle: 'High-Converting Pitch Deck & Quote',
        category: 'sales',
        categoryLabel: 'Sales',
        description: 'Design persuasive project proposals with structured scope, deliverables, milestones, and dynamic pricing tables.',
        icon: Zap,
        color: 'text-indigo-600',
        gradient: 'from-indigo-600 to-violet-500',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        badge: 'High Conversion',
        timeEstimate: '4 mins',
        clausesCount: '8 structured blocks',
        clauses: ['Executive Summary', 'Deliverables Matrix', 'Payment Milestones', 'Client Responsibilities', 'Change Request Terms'],
        rating: 4.9,
        reviewsCount: 980
    },
    {
        id: 'consulting-agreement',
        title: 'Consulting Agreement',
        subtitle: 'Client Scope & Service Contract',
        category: 'legal',
        categoryLabel: 'Legal',
        description: 'Formalize independent consulting and agency service contracts. Specify retainer fees, liability limits, and IP ownership.',
        icon: FileText,
        color: 'text-blue-600',
        gradient: 'from-blue-600 to-cyan-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'Agency Essential',
        timeEstimate: '3 mins',
        clausesCount: '14 comprehensive clauses',
        clauses: ['Scope of Services', 'Retainer & Hourly Billing', 'Independent Contractor Status', 'Work Product Ownership', 'Indemnification'],
        rating: 4.8,
        reviewsCount: 760
    },
    {
        id: 'invoice',
        title: 'Professional Invoice',
        subtitle: 'Itemized Billing & Tax Calculation',
        category: 'billing',
        categoryLabel: 'Billing',
        description: 'Generate polished, print-ready invoices with automated line items, discounts, tax rates, and payment gateway directions.',
        icon: Receipt,
        color: 'text-amber-600',
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'Get Paid 2x Faster',
        timeEstimate: '1 min',
        clausesCount: 'Standard Itemized Format',
        clauses: ['Auto Tax/Discount Engine', 'Payment Terms & Late Fees', 'Bank/Wire/Stripe Directions', 'Itemized Line Items'],
        rating: 4.9,
        reviewsCount: 1850
    },
    {
        id: 'signature',
        title: 'Electronic Signatures',
        subtitle: 'ESIGN & eIDAS Compliant eSign',
        category: 'signatures',
        categoryLabel: 'Signatures',
        description: 'Upload any document, place drag-and-drop signature fields, and invite multiple recipients for tamper-evident digital signing.',
        icon: PenTool,
        color: 'text-purple-600',
        gradient: 'from-purple-600 to-pink-500',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        badge: 'Zero Subscription Fees',
        timeEstimate: '30 secs',
        clausesCount: 'Cryptographic Audit Trail',
        clauses: ['Multi-party Signer Flow', 'SHA-256 Audit Certificate', 'IP & Timestamp Logging', 'Mobile Signing Pad'],
        rating: 5.0,
        reviewsCount: 2200
    },
    {
        id: 'offer-letter',
        title: 'Employee Offer Letter',
        subtitle: 'Talent Acquisition & Compensation',
        category: 'hr',
        categoryLabel: 'HR',
        description: 'Send clear, professional job offers including compensation packages, benefits, equity terms, and at-will employment terms.',
        icon: UserCheck,
        color: 'text-rose-600',
        gradient: 'from-rose-500 to-red-500',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        badge: 'HR Ready',
        timeEstimate: '2 mins',
        clausesCount: '10 employment clauses',
        clauses: ['Salary & Equity Details', 'Benefits & PTO Schedule', 'At-Will Employment', 'Confidentiality Adherence', 'Start Date Milestones'],
        rating: 4.8,
        reviewsCount: 640
    }
];

export const clientLogos = [
    { name: 'Apex Digital', category: 'Creative Agency' },
    { name: 'Vanguard Labs', category: 'SaaS Studio' },
    { name: 'Kroma Capital', category: 'Venture Capital' },
    { name: 'HyperScale', category: 'Growth Consultancy' },
    { name: 'Stratum Legal', category: 'Legal Advisory' },
    { name: 'Nexus Media', category: 'Media Network' },
    { name: 'CloudPeak Tech', category: 'Enterprise Cloud' },
    { name: 'Forge & Co', category: 'Design Collective' }
];

export const statistics = [
    { value: '250,000+', label: 'Documents Generated', change: '+42% this quarter', icon: FileText },
    { value: '99.98%', label: 'Legal Audit Enforceability', change: 'ESIGN & eIDAS aligned', icon: ShieldCheck },
    { value: '< 90s', label: 'Average Creation Time', change: '3x faster than Word/Docs', icon: Zap },
    { value: '$4.2M+', label: 'Saved in Legal & DocuSign Fees', change: 'Across 12,000+ users', icon: HeartHandshake }
];

export const testimonials = [
    {
        name: 'Sarah Jenkins',
        role: 'Founder & Managing Director',
        company: 'Apex Design Agency',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'DocForge completely replaced our $120/month DocuSign + PandaDoc stack. Being able to draft an NDA or proposal and send it for signature instantly has streamlined our sales cycle by 40%.',
        rating: 5,
        metric: 'Cut proposal turnaround from 2 days to 15 mins'
    },
    {
        name: 'Marcus Chen',
        role: 'Head of Operations',
        company: 'Vanguard Tech Labs',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'The audit trails and cryptographic certificate stamps give our enterprise clients 100% confidence. It looks clean, performs instantly, and never asks clients for tedious account registrations.',
        rating: 5,
        metric: 'Closed $380k in contracts using DocForge proposals'
    },
    {
        name: 'Elena Rostova',
        role: 'Fractional CMO & Consultant',
        company: 'Rostova Advisory',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Generating consulting agreements and itemized invoices in one place is magic. The real-time document status alerts tell me the exact minute a prospect opens my proposal.',
        rating: 5,
        metric: '100% invoice collection rate within 48h'
    }
];

export const faqs = [
    {
        category: 'general',
        q: "Is DocForge really free to start? What's the catch?",
        a: "Yes, 100% free! You can draft, customize, and download professional documents with your free account without entering a credit card. We offer a generous free starter tier and free e-signatures to help growing agencies and freelancers launch without friction."
    },
    {
        category: 'legal',
        q: "Are DocForge electronic signatures legally binding?",
        a: "Yes. DocForge digital signatures comply with the US Federal ESIGN Act, the Uniform Electronic Transactions Act (UETA), and European eIDAS standards. Every signed document generates a tamper-evident audit certificate with signer IP addresses, emails, cryptographic SHA-256 hashes, and UTC timestamps."
    },
    {
        category: 'general',
        q: "Do I need to install any software or plugins?",
        a: "No installation is required. DocForge runs entirely in any modern web browser on desktop, tablet, or smartphone with real-time sync and instant PDF rendering."
    },
    {
        category: 'collaboration',
        q: "Can I collaborate with my team and clients?",
        a: "Yes! With a DocForge account, you can invite team members with granular permission roles (Owner, Editor, Viewer), share reusable document templates, and track when clients open and sign your shared documents."
    },
    {
        category: 'security',
        q: "How is my confidential data and intellectual property protected?",
        a: "All data is encrypted in transit via TLS 1.3 and at rest with 256-bit AES encryption. We do not sell your data or share your contract contents with third parties. Your documents belong solely to you."
    },
    {
        category: 'export',
        q: "What export and sharing formats are supported?",
        a: "You can download high-resolution vector PDF documents, generate secure one-click public view links with view tracking, send direct email signing requests, or print directly with customized print styles."
    }
];

