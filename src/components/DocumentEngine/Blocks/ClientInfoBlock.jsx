import React from 'react';
import { User, Mail, Phone, MapPin, Building } from 'lucide-react';
import { resolveVariables } from '../../../utils/variableResolver';

const ClientInfoBlock = ({ data = {}, onChange, readOnly = false, resolvedContext = null }) => {
    const rawLabel = data.label || 'PREPARED FOR / CLIENT:';
    const rawClientName = data.clientName ?? '{{client.name}}';
    const rawCompanyName = data.companyName ?? '{{client.company}}';
    const rawClientEmail = data.clientEmail ?? '{{client.email}}';
    const rawClientPhone = data.clientPhone ?? '{{client.phone}}';
    const rawClientAddress = data.clientAddress ?? '{{client.address}}';

    const clientName = resolvedContext ? resolveVariables(rawClientName, resolvedContext) : rawClientName;
    const companyName = resolvedContext ? resolveVariables(rawCompanyName, resolvedContext) : rawCompanyName;
    const clientEmail = resolvedContext ? resolveVariables(rawClientEmail, resolvedContext) : rawClientEmail;
    const clientPhone = resolvedContext ? resolveVariables(rawClientPhone, resolvedContext) : rawClientPhone;
    const clientAddress = resolvedContext ? resolveVariables(rawClientAddress, resolvedContext) : rawClientAddress;

    const handleFieldChange = (field, value) => {
        if (!readOnly && onChange) {
            onChange({ ...data, [field]: value });
        }
    };

    return (
        <div className="w-full my-4 p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 font-sans">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <User size={13} className="text-indigo-600" />
                <span>{rawLabel}</span>
            </div>

            <div className="space-y-1 text-sm text-slate-700">
                <div className="font-semibold text-slate-900 text-base flex items-center gap-2">
                    <input
                        type="text"
                        disabled={readOnly}
                        value={clientName}
                        onChange={(e) => handleFieldChange('clientName', e.target.value)}
                        placeholder="Client Full Name / Variable"
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded px-1 py-0.5 outline-none font-bold text-slate-900 transition disabled:opacity-90"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Building size={13} className="text-slate-400 shrink-0" />
                    <input
                        type="text"
                        disabled={readOnly}
                        value={companyName}
                        onChange={(e) => handleFieldChange('companyName', e.target.value)}
                        placeholder="Company / Organization"
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded px-1 py-0.5 outline-none transition disabled:opacity-90"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <input
                        type="text"
                        disabled={readOnly}
                        value={clientEmail}
                        onChange={(e) => handleFieldChange('clientEmail', e.target.value)}
                        placeholder="client@company.com"
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded px-1 py-0.5 outline-none transition disabled:opacity-90"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <input
                        type="text"
                        disabled={readOnly}
                        value={clientPhone}
                        onChange={(e) => handleFieldChange('clientPhone', e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded px-1 py-0.5 outline-none transition disabled:opacity-90"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <input
                        type="text"
                        disabled={readOnly}
                        value={clientAddress}
                        onChange={(e) => handleFieldChange('clientAddress', e.target.value)}
                        placeholder="Street Address, City, State, ZIP"
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded px-1 py-0.5 outline-none transition disabled:opacity-90"
                    />
                </div>
            </div>
        </div>
    );
};

export default ClientInfoBlock;
