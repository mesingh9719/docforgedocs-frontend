import { useEffect, useRef, useState } from 'react';
import { Building2, ChevronDown, ChevronLeft, ChevronRight, FileText, LayoutDashboard, LogOut, ScrollText, Settings, Users, X } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useAuth } from '../../context/AuthContext';
import './dashboard-shell.css';

// Children use the same permission filtering and link behavior as top-level items.
function NavigationItem({ item, compact, onNavigate, expand }) {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(null);
    const Icon = item.icon;
    const containsActive = (entry) => entry.path && (pathname === entry.path || pathname.startsWith(`${entry.path}/`)) || entry.children?.some(containsActive);
    const activeChild = item.children?.some(containsActive);
    const expanded = !compact && (open ?? activeChild);
    const label = <>{Icon && <Icon size={20} strokeWidth={1.8} aria-hidden="true" />}<span className={compact ? 'sr-only' : 'sidebar-label'}>{item.label}</span></>;

    if (item.disabled) return <li><button className="sidebar-link" disabled title={compact ? item.label : undefined}>{label}</button></li>;
    if (item.children) return (
        <li>
            <button className={`sidebar-link ${activeChild ? 'sidebar-parent-active' : ''}`} aria-expanded={!!expanded}
                title={compact ? item.label : undefined} onClick={() => { if (compact) expand(); setOpen(!expanded); }}>
                {label}{!compact && <ChevronDown size={16} className={`sidebar-chevron ${expanded ? 'is-open' : ''}`} aria-hidden="true" />}
            </button>
            {expanded && <ul className="sidebar-children">{item.children.map(child => <NavigationItem key={child.path || child.label} item={child} compact={false} onNavigate={onNavigate} expand={expand} />)}</ul>}
        </li>
    );
    return <li><NavLink to={item.path} onClick={onNavigate} title={compact ? item.label : undefined}
        className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>{label}</NavLink></li>;
}

const Sidebar = ({ business, mobileMenuOpen, setMobileMenuOpen }) => {
    const isMobile = useMediaQuery('(max-width: 1023px)');
    const [collapsed, setCollapsed] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const { can } = usePermissions();
    const { logout } = useAuth();
    const compact = collapsed && !isMobile;
    const businessName = business?.name || 'DocForge';

    useEffect(() => {
        if (!isMobile || !mobileMenuOpen) return;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const focusFrame = requestAnimationFrame(() => sidebarRef.current?.querySelector('button')?.focus());
        const handleKey = (event) => {
            if (event.key === 'Escape') { event.preventDefault(); setMobileMenuOpen(false); }
            if (event.key !== 'Tab') return;
            const elements = sidebarRef.current.querySelectorAll('a[href], button:not(:disabled)');
            const first = elements[0];
            const last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        };
        document.addEventListener('keydown', handleKey);
        return () => {
            cancelAnimationFrame(focusFrame);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKey);
            previousFocus?.focus();
        };
    }, [isMobile, mobileMenuOpen, setMobileMenuOpen]);

    const filterItems = (items) => items.filter(item => !item.permission || can(item.permission)).map(item =>
        item.children ? { ...item, children: filterItems(item.children) } : item
    ).filter(item => !item.children || item.children.length);
    const navItems = filterItems([
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Documents', path: '/documents', permission: 'document.view' },
        { icon: ScrollText, label: 'Signatures', path: '/signatures/list', permission: 'settings.signature' },
        { icon: Users, label: 'Team', path: '/team', permission: 'team.view' },
        { icon: Settings, label: 'Settings', path: '/settings', permission: 'settings.view' },
    ]);

    return (
        <aside ref={sidebarRef} id="workspace-sidebar" aria-label="Workspace navigation"
            role={isMobile && mobileMenuOpen ? 'dialog' : undefined} aria-modal={isMobile && mobileMenuOpen ? true : undefined}
            inert={isMobile && !mobileMenuOpen ? true : undefined}
            className={`no-print workspace-sidebar ${compact ? 'is-collapsed' : ''} ${mobileMenuOpen ? 'is-mobile-open' : ''}`}>
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon"><Building2 size={21} strokeWidth={1.8} aria-hidden="true" /></div>
                {!compact && <div className="min-w-0 flex-1"><div className="sidebar-business" title={businessName}>{businessName}</div><div className="sidebar-caption">Workspace</div></div>}
                {isMobile && <button className="sidebar-icon-button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>}
            </div>
            <nav className="sidebar-navigation" aria-label="Main navigation">
                <div className="sidebar-section-label">{compact ? <span aria-hidden="true">—</span> : 'Workspace'}</div>
                <ul className="space-y-1">{navItems.map(item => <NavigationItem key={item.path} item={item} compact={compact} expand={() => setCollapsed(false)} onNavigate={() => isMobile && setMobileMenuOpen(false)} />)}</ul>
            </nav>
            <div className="sidebar-footer">
                {!isMobile && <button className="sidebar-link sidebar-collapse" onClick={() => setCollapsed(!collapsed)} aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!compact} title={compact ? 'Expand sidebar' : undefined}>
                    {compact ? <ChevronRight size={20} aria-hidden="true" /> : <ChevronLeft size={20} aria-hidden="true" />}{!compact && <span>Collapse sidebar</span>}
                </button>}
                <button className="sidebar-link" title={compact ? 'Log out' : undefined} onClick={async () => { await logout(); navigate('/'); }}>
                    <LogOut size={20} strokeWidth={1.8} aria-hidden="true" /><span className={compact ? 'sr-only' : ''}>Log out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
