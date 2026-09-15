import React from 'react';
import { DollarSign } from 'lucide-react';
import { resolveVariables } from '../../../utils/variableResolver';

const TotalsBlock = ({ data = {}, onChange, readOnly = false, resolvedContext = null }) => {
    const currency = data.currency || '$';
    const subtotal = parseFloat(data.subtotal || 0);
    const taxRate = parseFloat(data.taxRate || 0);
    const discount = parseFloat(data.discount || 0);
    const shipping = parseFloat(data.shipping || 0);
    const rawNotes = data.notes || 'Payment is due within 30 days of invoice date.';

    const notes = resolvedContext ? resolveVariables(rawNotes, resolvedContext) : rawNotes;

    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = Math.max(0, subtotal - discount + taxAmount + shipping);

    const handleFieldChange = (field, val) => {
        if (!readOnly && onChange) {
            onChange({ ...data, [field]: val });
        }
    };

    return (
        <div className="w-full my-6 flex flex-col sm:flex-row gap-6 items-start justify-between">
            {/* Left: Terms / Notes */}
            <div className="flex-1 text-xs text-slate-500 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Notes & Terms:</span>
                <textarea
                    disabled={readOnly}
                    value={notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    rows={3}
                    placeholder="Enter payment notes, bank details, or terms..."
                    className="w-full bg-transparent border-none outline-none resize-none text-slate-600 focus:bg-white focus:ring-1 focus:ring-indigo-500 rounded p-1 disabled:opacity-90"
                />
            </div>

            {/* Right: Totals Card */}
            <div className="w-full sm:w-72 bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-xs space-y-2.5">
                <div className="flex justify-between items-center text-slate-600">
                    <span>Subtotal</span>
                    <div className="flex items-center gap-1">
                        <span>{currency}</span>
                        <input
                            type="number"
                            disabled={readOnly}
                            value={data.subtotal ?? 0}
                            onChange={(e) => handleFieldChange('subtotal', parseFloat(e.target.value) || 0)}
                            className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-medium outline-none focus:border-indigo-500 disabled:opacity-90"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                    <span>Tax ({taxRate}%)</span>
                    <div className="flex items-center gap-1">
                        <span>{currency}</span>
                        <input
                            type="number"
                            value={taxAmount.toFixed(2)}
                            readOnly
                            className="w-20 text-right bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 font-medium cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center text-emerald-600">
                    <span>Discount</span>
                    <div className="flex items-center gap-1">
                        <span>-{currency}</span>
                        <input
                            type="number"
                            disabled={readOnly}
                            value={data.discount ?? 0}
                            onChange={(e) => handleFieldChange('discount', parseFloat(e.target.value) || 0)}
                            className="w-20 text-right bg-emerald-50/50 border border-emerald-200 rounded px-1.5 py-0.5 font-medium text-emerald-700 outline-none focus:border-emerald-500 disabled:opacity-90"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-base font-extrabold text-indigo-600">
                        {currency}{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TotalsBlock;
