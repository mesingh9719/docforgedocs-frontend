import { createElement, useEffect, useState } from 'react';
import { Activity, ArrowRight, CheckCheck, Clock3, FileText, Plus, RefreshCw, Send, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getRecentActivity } from '../../api/dashboard';
import DashboardCharts from '../../components/Dashboard/DashboardCharts';
import TemplateModal from '../../components/Dashboard/TemplateModal';
import { usePermissions } from '../../hooks/usePermissions';
import './dashboard-overview.css';

export default function DashboardHome() {
    const [state, setState] = useState({ loading: true, stats: null, activity: [] });
    const [refreshKey, setRefreshKey] = useState(0);
    const [range, setRange] = useState('30d');
    const [templatesOpen, setTemplatesOpen] = useState(false);
    const { can } = usePermissions();
    useEffect(() => {
        let active = true;
        Promise.allSettled([getDashboardStats(), getRecentActivity()]).then(([stats, activity]) => {
            if (!active) return;
            setState({ loading: false, stats: stats.status === 'fulfilled' ? stats.value.data : null, activity: activity.status === 'fulfilled' ? activity.value.data : [], statsError: stats.status === 'rejected', activityError: activity.status === 'rejected', updatedAt: new Date() });
        });
        return () => { active = false; };
    }, [refreshKey]);
    const stats = state.stats;
    const total = stats?.total_documents || 0;
    const draft = stats?.breakdown?.draft || 0;
    const sent = stats?.breakdown?.sent || 0;
    const completed = stats?.breakdown?.completed || 0;
    const metrics = [
        { label: 'Total documents', value: total, detail: 'All documents in your workspace', icon: FileText },
        { label: 'In draft', value: draft, detail: 'Ready for your next edit', icon: Clock3 },
        { label: 'Sent documents', value: sent, detail: 'Sent and not yet completed', icon: Send },
        { label: 'Completion rate', value: `${total ? Math.round(completed / total * 100) : 0}%`, detail: `${completed.toLocaleString()} of ${total.toLocaleString()} documents completed`, icon: CheckCheck },
    ];
    const refresh = () => { setState(s => ({ ...s, loading: true })); setRefreshKey(n => n + 1); };
    return <div className="dashboard-overview max-w-7xl mx-auto space-y-6 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-2">Workspace overview</p><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Your work, at a glance</h2><p className="text-sm text-slate-500 mt-2">Track document activity and keep your next steps in view.</p></div>
            <div className="flex flex-wrap items-center gap-2">
                <button className="overview-button" onClick={refresh} disabled={state.loading}><RefreshCw size={16} aria-hidden="true" />{state.loading ? 'Refreshing…' : 'Refresh'}</button>
                {can('document.view') && can('document.create') && <button className="overview-button overview-primary" onClick={() => setTemplatesOpen(true)}><Plus size={16} aria-hidden="true" />Create document</button>}
            </div>
        </div>
        {state.statsError && !state.loading && <div role="alert" className="overview-card text-sm text-slate-600">Workspace totals couldn’t be loaded. Use Refresh to try again.</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-busy={state.loading}>
            {metrics.map(({ label, value, detail, icon: Icon }) => <section key={label} className="overview-card">
                <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-medium text-slate-600">{label}</h3>{createElement(Icon, { size: 18, className: 'text-slate-400', 'aria-hidden': true })}</div>
                <p className="text-3xl font-semibold tracking-tight text-slate-900 mt-5 tabular-nums">{state.loading ? '…' : stats ? value.toLocaleString() : '—'}</p>
                <p className="text-xs text-slate-500 mt-2">{state.loading ? 'Loading workspace totals' : stats ? detail : 'Data unavailable'}</p>
            </section>)}
        </div>
        <DashboardCharts key={refreshKey} stats={state.loading ? null : stats} range={range} setRange={setRange} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <section className="overview-card xl:col-span-2 min-w-0" aria-labelledby="recent-heading">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-5"><div><h3 id="recent-heading" className="overview-heading">Recently updated</h3><p className="overview-description">Latest document updates · up to 10 documents</p></div>{can('document.view') && <Link className="overview-text-link" to="/documents">All documents <ArrowRight size={14} /></Link>}</div>
                {state.loading ? <p role="status" className="overview-chart-message">Loading recent updates…</p> : state.activityError ? <p role="alert" className="overview-chart-message">Recent updates couldn’t be loaded. Try Refresh.</p> : state.activity.length === 0 ? <div className="overview-chart-message"><Activity size={26} className="text-slate-400 mb-3" aria-hidden="true" /><p>No document updates yet.</p><p className="overview-description">Your latest work will appear here.</p></div> : <ul className="divide-y divide-slate-100">{state.activity.map(item => <li key={item.id} className="flex items-start gap-3 py-4">
                    <span className="h-9 w-9 shrink-0 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold" aria-hidden="true">{item.initials || 'DF'}</span>
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-800 break-words">{item.project || 'Untitled document'}</p><p className="text-xs text-slate-500 mt-1 break-words">{item.user} · {item.action}</p></div><span className="text-xs text-slate-500 whitespace-nowrap pt-0.5">{item.time}</span>
                </li>)}</ul>}
            </section>
            <div className="space-y-5">
                <section className="overview-card"><h3 className="overview-heading">Keep work moving</h3><p className="overview-description">Your current document pipeline</p>
                    {stats ? <div className="mt-5 space-y-4"><div className="flex gap-3"><Clock3 size={18} className="text-slate-500 shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-slate-800">{draft} {draft === 1 ? 'draft' : 'drafts'} to review</p><p className="overview-description">Finish editing before sending.</p></div></div><div className="flex gap-3"><Send size={18} className="text-slate-500 shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-slate-800">{sent} sent {sent === 1 ? 'document' : 'documents'}</p><p className="overview-description">Check progress and follow up as needed.</p></div></div>{can('document.view') && <Link className="overview-button justify-center w-full" to="/documents">Review documents <ArrowRight size={15} /></Link>}</div> : <p className="overview-description mt-5">{state.loading ? 'Loading your pipeline…' : 'Pipeline data unavailable.'}</p>}
                </section>
                <section className="overview-card"><h3 className="overview-heading">Workspace shortcuts</h3><div className="mt-3 divide-y divide-slate-100">
                    {can('settings.signature') && <Link className="overview-shortcut" to="/signatures/list"><CheckCheck size={18} /><span className="flex-1">Manage signatures</span><ArrowRight size={14} /></Link>}
                    {can('team.view') && <Link className="overview-shortcut" to="/team"><Users size={18} /><span className="flex-1">Team members</span><span className="text-xs text-slate-500">{stats?.team_size ?? '—'}</span><ArrowRight size={14} /></Link>}
                    {can('settings.view') && <Link className="overview-shortcut" to="/settings"><FileText size={18} /><span className="flex-1">Workspace settings</span><ArrowRight size={14} /></Link>}
                    {!can('settings.signature') && !can('team.view') && !can('settings.view') && <p className="overview-description py-3">Shortcuts appear here based on your workspace access.</p>}
                </div></section>
            </div>
        </div>
        <p className="text-xs text-slate-500" role="status">{state.loading ? 'Updating dashboard…' : `Last refresh ${state.updatedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Summary metrics are all time; creation trends use the selected period.`}</p>
        <TemplateModal isOpen={templatesOpen} onClose={() => setTemplatesOpen(false)} />
    </div>;
}
