import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { getBusiness } from '../../api/business';

function DashboardLayout() {
    const [business, setBusiness] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        toast.dismiss(); // Dismiss all toasts when entering dashboard
        const fetchBusiness = async () => {
            try {
                const data = await getBusiness();
                setBusiness(data);
            } catch (error) {
                console.error("Failed to fetch business", error);
            }
        };

        fetchBusiness();
    }, []);

    return (
        <div className="dashboard-shell flex bg-slate-50 min-h-screen">
            <Sidebar business={business} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            {/* Mobile Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative overflow-x-hidden">
                <TopBar mobileMenuOpen={mobileMenuOpen} onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;