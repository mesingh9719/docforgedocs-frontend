import { Shield, Zap, FileText } from 'lucide-react';

export const templates = [
    {
        id: 'nda',
        title: 'Non-Disclosure Agreement',
        subtitle: 'Protect your ideas instantly.',
        description: 'Generate a legally binding NDA in minutes. Perfect for freelancers, agencies, and startup discussions.',
        icon: Shield,
        color: 'bg-emerald-500',
        gradient: 'from-emerald-500 to-teal-400',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100'
    },
    {
        id: 'proposal',
        title: 'Business Proposal',
        subtitle: 'Win more clients, faster.',
        description: 'Create stunning, structured proposals with pricing tables and timelines. Export as PDF or send online.',
        icon: Zap,
        color: 'bg-indigo-500',
        gradient: 'from-indigo-500 to-purple-500',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100'
    },
    {
        id: 'consulting-agreement',
        title: 'Consulting Agreement',
        subtitle: 'Secure your services.',
        description: 'Formalize your client relationships with a comprehensive consulting services agreement.',
        icon: FileText,
        color: 'bg-blue-500',
        gradient: 'from-blue-500 to-cyan-400',
        bg: 'bg-blue-50',
        border: 'border-blue-100'
    }
];

export const faqs = [
    {
        q: "Is it really free? What's the catch?",
        a: "Yes, it is 100% free to generate and export documents. We provide this tool to help freelancers and small businesses."
    },
    {
        q: "Do I need to create an account first?",
        a: "No! You can draft your entire document as a guest. We only ask you to create a password when you save/export, so you can access your document later. It's a seamless process."
    },
    {
        q: "Are these documents legally binding?",
        a: "Our templates are drafted by legal professionals to be standard and enforceable. However, we are not a law firm, and for high-stakes deals, we always recommend consulting a lawyer."
    },
    {
        q: "Can I edit the document after saving?",
        a: "Absolutely. Once you save, the document is stored in your secure dashboard. You can edit, duplicate, or send it for signature at any time."
    }
];
