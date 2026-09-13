import StatusBadge from '../../../../components/ui/StatusBadge';
import React, { memo } from 'react';
import { CheckCircle, FileText, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

const SignatureMobileCard = memo(({
    doc,
    getProgress,
    setSelectedDoc,
    setActiveDrawer
}) => {
    const progress = getProgress(doc.signers);

    return (
        <div
            className="p-5 flex flex-col gap-4 active:bg-slate-50 border-b border-slate-100 last:border-0"
            onClick={() => { setSelectedDoc(doc); setActiveDrawer('preview'); }}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${doc.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                        {doc.status === 'completed' ? <CheckCircle size={20} /> : <FileText size={20} strokeWidth={1.5} />}
                    </div>
                    <div className="min-w-0">
                        <h3><button className="text-left font-semibold text-slate-800 text-sm line-clamp-2 break-words" onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); setActiveDrawer("preview"); }}>{doc.name || "Untitled"}</button></h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <StatusBadge status={doc.status} />
                            <span className="text-[10px] text-slate-400">{format(new Date(doc.updated_at), 'M/d/yy')}</span>
                        </div>
                    </div>
                </div>
                <button
                    aria-label={`View details for ${doc.name || "request"}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                        setActiveDrawer('preview');
                    }}
                    className="p-1 text-slate-300 hover:text-slate-600"
                >
                    <MoreVertical size={20} />
                </button>
            </div>

            {doc.signers?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500 font-medium">{doc.signers.filter(s => s.status === 'signed').length} of {doc.signers.length} signed</span>
                        <span className="font-bold text-indigo-600">{progress}%</span>
                    </div>
                    <div role="progressbar" aria-label="Signature completion" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                        <div className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {doc.signers.map((s, i) => (
                            <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold ${s.status === 'signed' ? 'bg-emerald-700' : 'bg-slate-500'}`}>
                                {s.name?.charAt(0) || '?'}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

SignatureMobileCard.displayName = 'SignatureMobileCard';
export default SignatureMobileCard;
