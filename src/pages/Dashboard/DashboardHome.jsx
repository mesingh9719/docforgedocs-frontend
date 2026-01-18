
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity, FileText, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck } from 'lucide-react';
import { getDashboardStats, getRecentActivity } from '../../api/dashboard';

const DashboardHome = () => {
    const [statsData, setStatsData] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    getDashboardStats(),
                    getRecentActivity()
                ]);
                setStatsData(statsRes.data);
                setActivityData(activityRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const stats = [
        // Revenue placeholder (pending implementation)
        { label: 'Pending Documents', value: statsData?.pending_documents || 0, change: 'Waiting', isPositive: false, icon: Clock },
        { label: 'Active Members', value: statsData?.active_members || 0, change: 'Active', isPositive: true, icon: Users },
        { label: 'Total Documents', value: statsData?.total_documents || 0, change: 'Lifetime', isPositive: true, icon: FileText },
        // Conversion placeholder
        { label: 'Completion Rate', value: 'N/A', change: '-', isPositive: true, icon: Activity },
    ];

    if (loading) {
        return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 max-w-7xl mx-auto"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-slate-500">
                                <stat.icon size={20} strokeWidth={2} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded ${stat.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 bg-slate-50'}`}>
                                {stat.isPositive ? <ArrowUpRight size={12} /> : <Clock size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Card */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                        <div>
                            <h3 className="font-bold text-base text-slate-800">Recent Activity</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Latest updates from your team</p>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-y-auto max-h-[400px]">
                        {activityData.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 text-sm">No recent activity found.</div>
                        ) : (
                            activityData.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                                >
                                    <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                                        {activity.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{activity.user}</p>
                                            <span className="flex items-center text-[10px] font-medium text-slate-400 gap-1 whitespace-nowrap">
                                                {activity.time}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-0.5">{activity.action}</p>
                                        <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                                            <FileText size={10} />
                                            {activity.project}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions / Upgrade Card */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6">
                    {/* Professional Plan Widget - Flat */}
                    <div className="bg-slate-900 rounded-lg shadow-sm p-6 text-white border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="text-indigo-400" size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                Enterprise
                            </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">Upgrade to Pro</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Unlock unlimited documents, advanced analytics, and priority support.
                        </p>

                        <button className="w-full py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded hover:bg-indigo-500 transition-colors border border-transparent">
                            Upgrade Now
                        </button>

                        <div className="mt-6 pt-4 border-t border-slate-800">
                            <div className="flex justify-between items-center text-xs mb-2">
                                <span className="text-slate-400">Storage Used</span>
                                <span className="font-bold text-slate-300">78%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-indigo-500 rounded-full h-full w-[78%]"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;