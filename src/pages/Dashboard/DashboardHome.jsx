import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, FileText, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, Zap, MoreHorizontal, ChevronRight } from 'lucide-react';
import { getDashboardStats, getRecentActivity } from '../../api/dashboard';
import { Link } from 'react-router-dom';
import DashboardCharts from '../../components/Dashboard/DashboardCharts';

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
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    // Calculate Completion Rate
    const totalDocs = statsData?.total_documents || 0;
    const completedDocs = statsData?.breakdown?.completed || 0;
    const completionRate = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

    const stats = [
        { label: 'Draft Documents', value: statsData?.breakdown?.draft || 0, change: '+2.5%', isPositive: true, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { label: 'Team Members', value: statsData?.team_size || 0, change: '+0%', isPositive: true, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { label: 'Total Documents', value: totalDocs, change: '+12%', isPositive: true, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Completion Rate', value: `${completionRate}%`, change: '+1.2%', isPositive: true, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    ];

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <p className="text-slate-400 text-sm animate-pulse font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-7xl mx-auto pb-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/60">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Here's what's happening with your workspace today.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/documents" className="px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm shadow-sm flex items-center gap-2">
                        <FileText size={18} />
                        View Documents
                    </Link>
                    <button className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 flex items-center gap-2">
                        <Zap size={18} fill="currentColor" />
                        Quick Action
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group`}
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                                <stat.icon size={24} strokeWidth={2} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${stat.isPositive ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-slate-700 bg-slate-50 border border-slate-100'}`}>
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide text-[11px]">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <motion.div variants={itemVariants}>
                <DashboardCharts />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Feed */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
                            <p className="text-sm text-slate-500 mt-0.5 font-medium">Latest updates from your team</p>
                        </div>
                        <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="p-2">
                        <div className="overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-200 pr-2">
                            {activityData.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center text-slate-400">
                                    <Activity size={48} className="mb-4 opacity-50 text-slate-300" />
                                    <p className="text-sm font-medium">No recent activity found.</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {activityData.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="p-4 flex items-start gap-4 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-indigo-600 uppercase shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                                {activity.initials}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                                        {activity.user}
                                                    </p>
                                                    <span className="flex items-center text-[10px] font-bold text-slate-400 gap-1 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-wide">
                                                        {activity.time}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                                    {activity.action} <span className="text-slate-300 mx-1">•</span> <span className="font-medium text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-xs">{activity.project}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Side Widgets */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6">
                    {/* Pro Plan Widget */}
                    {/* <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 text-white border border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-800/30 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20">
                                <ShieldCheck className="text-indigo-400" size={24} />
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-white tracking-tight">Upgrade to Enterprise</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                                Get access to advanced analytics, unlimited team members, and dedicated support.
                            </p>

                            <button className="w-full py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/20 hover:-translate-y-0.5">
                                Upgrade Plan
                            </button>

                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <div className="flex justify-between items-center text-xs mb-2">
                                    <span className="text-slate-400 font-medium">Storage Usage</span>
                                    <span className="font-bold text-indigo-300">7.8 GB / 10 GB</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                                    <div className="bg-indigo-500 rounded-full h-full w-[78%]"></div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Quick Tips or Secondary Widget could go here */}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;