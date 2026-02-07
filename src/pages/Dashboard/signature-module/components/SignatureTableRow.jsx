import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, FileText, CheckCircle, Clock, Mail, Eye, History, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const SignatureTableRow = memo(({
    doc,
    isSelected,
    toggleSelect,
    getStatusInfo,
    getProgress,
    handleResendReminder,
    handleDelete,
    setSelectedDoc,
    setActiveDrawer
}) => {
    const status = getStatusInfo(doc);
    const progress = getProgress(doc.signers);

    return (
        <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
            className={`group transition-colors ${isSelected ? 'bg-indigo-50/50' : ''} border-b border-slate-50 last:border-0`}
        >
            <td className="px-6 py-4 w-12">
                <button
                    onClick={() => toggleSelect(doc.id)}
                    className={`transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}
                >
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${doc.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600'
                        }`}>
                        {doc.status === 'completed' ? <CheckCircle size={20} /> : <FileText size={20} strokeWidth={1.5} />}
                    </div>
                    <div>
                        <p
                            className="font-semibold text-slate-700 text-sm hover:text-indigo-600 cursor-pointer transition-colors line-clamp-1"
                            onClick={() => { setSelectedDoc(doc); setActiveDrawer('preview'); }}
                        >
                            {doc.name || "Untitled Document"}
                        </p>
                        <span className="text-[11px] text-slate-400 font-mono">ID: #{doc.id.toString().slice(-6)}</span>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="space-y-1.5">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${status.color}`}>
                        <status.icon size={10} />
                        {status.label}
                    </div>

                    {doc.signers?.length > 0 && (
                        <div className="w-32">
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-medium">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex -space-x-2">
                    {doc.signers?.slice(0, 4).map((s, i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-slate-100 relative group/avatar ${s.status === 'signed' ? 'bg-emerald-500' : s.status === 'viewed' ? 'bg-amber-400' : 'bg-indigo-300'
                                }`}
                            title={`${s.name} (${s.email}) - ${s.status}`}
                        >
                            {s.name.charAt(0).toUpperCase()}
                            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px]">
                                {s.status === 'signed' && <CheckCircle size={8} className="text-emerald-500 fill-emerald-100" />}
                            </div>
                        </div>
                    ))}
                    {doc.signers?.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                            +{doc.signers.length - 4}
                        </div>
                    )}
                    {(!doc.signers || doc.signers.length === 0) && (
                        <span className="text-xs text-slate-400 italic">No signers</span>
                    )}
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="text-sm text-slate-600 font-medium">
                    {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock size={10} />
                    {format(new Date(doc.updated_at), 'h:mm a')}
                </div>
            </td>

            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.status !== 'completed' && doc.signers?.some(s => s.status !== 'signed') && (
                        <button
                            onClick={() => handleResendReminder(doc.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Resend Signature Request"
                        >
                            <Mail size={16} />
                        </button>
                    )}

                    {doc.status === 'completed' && (
                        <Link
                            to={`/signatures/${doc.id}/view-signed`}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                            title="View Signed PDF"
                        >
                            <Eye size={16} />
                        </Link>
                    )}

                    <button
                        onClick={() => { setSelectedDoc(doc); setActiveDrawer('audit'); }}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                        title="View History"
                    >
                        <History size={16} />
                    </button>

                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </motion.tr>
    );
});

export default SignatureTableRow;
