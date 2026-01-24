import React, { useState, useEffect } from 'react';
import { getBusiness } from '../../../api/business';
import { Building2, FileText, Receipt, DollarSign, Loader, Palette, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GeneralSettings from './GeneralSettings';
import InvoiceSettings from './InvoiceSettings';
import TaxSettings from './TaxSettings';
import CurrencySettings from './CurrencySettings';
import BrandingSettings from './BrandingSettings';
import ProfileSettings from './ProfileSettings';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';
import toast from 'react-hot-toast';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBusiness();
    }, []);

    const fetchBusiness = async () => {
        try {
            const data = await getBusiness();
            setBusiness(data);
        } catch (error) {
            console.error("Failed to load business settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (updatedBusiness) => {
        setBusiness(updatedBusiness);
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User, desc: 'Personal & Security' },
        { id: 'general', label: 'Business Info', icon: Building2, desc: 'Organization Details' },
        { id: 'branding', label: 'Branding', icon: Palette, desc: 'Logos & Colors' },
        { id: 'invoice', label: 'Invoicing', icon: FileText, desc: 'Prefix & Terms' },
        { id: 'tax', label: 'Taxation', icon: Receipt, desc: 'VAT/GST Setup' },
        { id: 'currency', label: 'Currency', icon: DollarSign, desc: 'Region & Symbol' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }



    return (
        <div className="max-w-6xl mx-auto">
            <DashboardPageHeader
                title="Settings"
                subtitle="Manage your personal and workspace preferences."
            />

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                    <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-0.5 min-w-max md:min-w-0">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors whitespace-nowrap ${isActive ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                    <span className="text-sm">{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && <ProfileSettings />}
                            {activeTab === 'general' && <GeneralSettings business={business} onUpdate={handleUpdate} />}
                            {activeTab === 'branding' && <BrandingSettings business={business} onUpdate={handleUpdate} />}
                            {activeTab === 'invoice' && <InvoiceSettings business={business} onUpdate={handleUpdate} />}
                            {activeTab === 'tax' && <TaxSettings business={business} onUpdate={handleUpdate} />}
                            {activeTab === 'currency' && <CurrencySettings business={business} onUpdate={handleUpdate} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Settings;
