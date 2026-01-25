import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { getDashboardAnalytics } from "../../api/dashboard";
import { FileText, TrendingUp, ArrowUpRight, Calendar, Filter } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const DashboardCharts = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('6m'); // 7d, 30d, 90d, 6m, 1y

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            // In a real app, calculate actual dates based on dateRange
            // For now, we pass the range key to the backend or just rely on backend default '6m' logic
            // If backend accepted 'start_date' and 'end_date', we would generate them here.

            const response = await getDashboardAnalytics({ range: dateRange });
            setChartData(response.data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                <div className="lg:col-span-2 bg-white rounded-2xl h-[300px] shadow-sm border border-slate-200"></div>
                <div className="bg-white rounded-2xl h-[300px] shadow-sm border border-slate-200"></div>
            </div>
        );
    }

    if (!chartData) return null;

    const lineData = {
        labels: chartData.labels || [],
        datasets: [
            {
                label: "Documents Created",
                data: chartData.data || [],
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#6366f1",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)', // Slate 900
                padding: 12,
                titleFont: { size: 13, family: "'Inter', sans-serif", weight: '600' },
                bodyFont: { size: 12, family: "'Inter', sans-serif" },
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (context) => `Documents: ${context.parsed.y}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9',
                    borderDash: [5, 5],
                    drawBorder: false,
                },
                ticks: {
                    font: { size: 11, family: "'Inter', sans-serif" },
                    color: '#64748b',
                    padding: 10
                },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 11, family: "'Inter', sans-serif" },
                    color: '#64748b',
                    padding: 10
                },
                border: { display: false }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    const doughnutData = {
        labels: ["Draft", "Sent", "Completed"],
        datasets: [
            {
                data: chartData?.breakdown ? [chartData.breakdown.draft, chartData.breakdown.sent, chartData.breakdown.completed] : [0, 0, 0],
                backgroundColor: [
                    "#f59e0b", // Amber (Draft)
                    "#3b82f6", // Blue (Sent)
                    "#10b981", // Emerald (Completed)
                ],
                borderWidth: 0,
                hoverOffset: 10,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20,
                    font: { size: 12, family: "'Inter', sans-serif", weight: '500' },
                    color: '#475569'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => ` ${context.label}: ${context.parsed}`
                }
            }
        }
    };

    // calculate total for center text
    const totalDocs = chartData?.breakdown ? Object.values(chartData.breakdown).reduce((a, b) => a + b, 0) : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Trend Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Document Trends</h3>
                        <p className="text-sm text-slate-500 font-medium">Activity overview</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="6m">Last 6 Months</option>
                                <option value="1y">Last Year</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                                <Calendar size={14} />
                            </div>
                        </div>
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                            <TrendingUp size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <Line data={lineData} options={lineOptions} />
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Status Overview</h3>
                        <p className="text-sm text-slate-500 font-medium">Distribution by status</p>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <FileText size={20} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex-1 min-h-[250px] relative flex items-center justify-center py-4">
                    <Doughnut data={doughnutData} options={doughnutOptions} />

                    {/* Centered Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                        <div className="text-center">
                            <span className="block text-3xl font-extrabold text-slate-800 tracking-tight">{totalDocs}</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>Real-time data</span>
                    <Link to="/documents" className="text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1">
                        View Report <ArrowUpRight size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
