import './status-badge.css';

const labels = {
    draft: 'Draft', prepared: 'Prepared', sent: 'Sent', viewed: 'Viewed',
    pending: 'Pending', signed: 'Signed', completed: 'Completed',
    declined: 'Declined', cancelled: 'Cancelled', expired: 'Expired',
    signature_required: 'Signature required',
};

export default function StatusBadge({ status, label, className = '' }) {
    const key = String(status || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
    const tone = Object.hasOwn(labels, key) ? key : 'unknown';
    const text = label || labels[key] || (key ? key.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase()) : 'Unknown');
    return <span className={`status-badge status-badge--${tone} ${className}`}>
        <span className="status-badge-dot" aria-hidden="true" />
        {text}
    </span>;
}
