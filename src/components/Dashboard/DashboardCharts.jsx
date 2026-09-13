import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { getDashboardAnalytics } from '../../api/dashboard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ArcElement);
const colors = ['#94a3b8', '#7296bd', '#315f96', '#cbd5e1'];
const dashboardStatuses = (stats) => {
    const values = ['draft', 'sent', 'completed'].map(key => Number(stats?.breakdown?.[key]) || 0);
    return ['Draft', 'Sent', 'Completed', 'Other'].map((label, i) => ({ label, value: i < 3 ? values[i] : Math.max(0, (stats?.total_documents || 0) - values.reduce((a, b) => a + b, 0)), color: colors[i] }));
};

export default function DashboardCharts({ stats, range, setRange }) {
    const [result, setResult] = useState({ loading: true });
    const [retry, setRetry] = useState(0);
    useEffect(() => {
        let active = true;
        getDashboardAnalytics({ range }).then(({ data }) => {
            if (active) setResult({ data, loading: false });
        }).catch(() => { if (active) setResult({ error: true, loading: false }); });
        return () => { active = false; };
    }, [range, retry]);
    const rows = (result.data?.labels || []).map((label, i) => ({ label, value: Number(result.data.data?.[i]) || 0 }));
    const total = rows.reduce((sum, row) => sum + row.value, 0);
    const peak = rows.reduce((best, row) => row.value > best.value ? row : best, { value: 0, label: '—' });
    const statuses = dashboardStatuses(stats);
    const options = {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', padding: 12, displayColors: false } },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: '#64748b', maxTicksLimit: 7, maxRotation: 0 } },
            y: { beginAtZero: true, border: { display: false }, ticks: { precision: 0, color: '#64748b' }, grid: { color: '#f1f5f9' } },
        },
    };
    return <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="overview-card xl:col-span-2 min-w-0" aria-labelledby="creation-heading" aria-busy={result.loading}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div><h3 id="creation-heading" className="overview-heading">Document creation</h3><p className="overview-description">Daily volume · includes today</p></div>
                <select aria-label="Document creation period" className="overview-select" value={range} onChange={e => { setResult({ loading: true }); setRange(e.target.value); }}>
                    <option value="7d">Last 7 days</option><option value="30d">Last 30 days</option>
                </select>
            </div>
            {result.loading ? <div role="status" className="overview-chart-message">Loading document trends…</div> : result.error ? <div role="alert" className="overview-chart-message"><p>Document trends couldn’t be loaded.</p><button className="overview-button mt-3" onClick={() => { setResult({ loading: true }); setRetry(n => n + 1); }}>Try again</button></div> : <>
                <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6 mb-6">
                    <div><span className="text-2xl font-semibold text-slate-900 tabular-nums">{total.toLocaleString()}</span><p className="overview-description">Created in this period</p></div>
                    <div><span className="text-2xl font-semibold text-slate-900 tabular-nums">{rows.length ? (total / rows.length).toFixed(1) : '0'}</span><p className="overview-description">Daily average</p></div>
                    <div><span className="text-2xl font-semibold text-slate-900">{peak.label}</span><p className="overview-description">Busiest day{peak.value ? ` · ${peak.value} documents` : ''}</p></div>
                </div>
                {total ? <div className="h-60"><Line role="img" aria-label={`${total} documents created in the last ${range === '7d' ? 7 : 30} days. Daily values are available in the data table below.`} options={options} data={{ labels: rows.map(r => r.label), datasets: [{ label: 'Documents created', data: rows.map(r => r.value), borderColor: '#315f96', backgroundColor: '#eff5fb', fill: true, tension: 0.2, pointRadius: range === '7d' ? 3 : 0, pointHitRadius: 12, borderWidth: 2 }] }} /></div> : <div className="h-60 overview-chart-message"><p>No documents created in this period.</p><p className="overview-description">Choose another period or create your first document.</p></div>}
                <details className="mt-5 border-t border-slate-100 pt-4"><summary className="text-xs font-medium text-slate-600 cursor-pointer">View daily data</summary><div className="max-h-48 overflow-auto mt-3"><table className="w-full text-sm text-left"><caption className="sr-only">Daily document creation counts</caption><thead><tr><th scope="col" className="py-2">Date</th><th scope="col" className="text-right">Documents</th></tr></thead><tbody>{rows.map((row, i) => <tr key={i} className="border-t border-slate-100"><td className="py-2">{row.label}</td><td className="text-right tabular-nums">{row.value}</td></tr>)}</tbody></table></div></details>
            </>}
        </section>
        <section className="overview-card min-w-0" aria-labelledby="status-heading">
            <h3 id="status-heading" className="overview-heading">Document status</h3><p className="overview-description">Current status · all time</p>
            {!stats ? <p className="overview-chart-message">Status data unavailable.</p> : <>
                <div className="relative h-52 my-5">
                    {stats.total_documents > 0 ? <Doughnut role="img" aria-label={statuses.map(s => `${s.label}: ${s.value}`).join(', ')} data={{ labels: statuses.map(s => s.label), datasets: [{ data: statuses.map(s => s.value), backgroundColor: colors, borderWidth: 3, borderColor: '#fff', hoverOffset: 2 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: '78%', animation: false, plugins: { legend: { display: false } } }} /> : <div className="w-48 h-48 mx-auto rounded-full border-[20px] border-slate-100" />}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl font-semibold text-slate-900 tabular-nums">{stats.total_documents.toLocaleString()}</span><span className="overview-description">Total documents</span></div>
                </div>
                <ul className="space-y-3">{statuses.filter(s => s.label !== 'Other' || s.value > 0).map(s => <li key={s.label} className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /><span className="flex-1 text-slate-600">{s.label}</span><span className="font-semibold tabular-nums">{s.value.toLocaleString()}</span><span className="w-12 text-right text-xs text-slate-500 tabular-nums">{stats.total_documents ? Math.round(s.value / stats.total_documents * 100) : 0}%</span></li>)}</ul>
                <p className="text-xs text-slate-500 border-t border-slate-100 mt-5 pt-4">Status totals include all documents, regardless of the chart period.</p>
            </>}
        </section>
    </div>;
}
