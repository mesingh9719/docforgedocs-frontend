import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { resolveVariables } from '../../../utils/variableResolver';

const DynamicTableBlock = ({ data = {}, onChange, readOnly = false, resolvedContext = null }) => {
    const currency = data.currency || '$';
    const taxRate = parseFloat(data.taxRate || 0);
    const discountRate = parseFloat(data.discountRate || 0);
    const showTotals = data.showTotals !== false;

    // Default columns if none provided
    const columns = data.columns && data.columns.length > 0 ? data.columns : [
        { key: 'description', label: 'Item & Description', type: 'text', width: '50%' },
        { key: 'quantity', label: 'Qty', type: 'number', width: '15%' },
        { key: 'rate', label: 'Rate', type: 'currency', width: '15%' },
        { key: 'total', label: 'Amount', type: 'calculated', width: '20%' },
    ];

    // Default rows
    const rows = data.rows && data.rows.length > 0 ? data.rows : [
        { description: 'Design and Architecture Specification', quantity: 1, rate: 1500 },
        { description: 'Component Implementation & Integration', quantity: 1, rate: 2500 },
    ];

    const calculateRowTotal = (row) => {
        const qty = parseFloat(row.quantity) || 0;
        const rate = parseFloat(row.rate) || 0;
        return qty * rate;
    };

    const subtotal = rows.reduce((acc, row) => acc + calculateRowTotal(row), 0);
    const discountAmount = (subtotal * discountRate) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const grandTotal = taxableAmount + taxAmount;

    const handleRowChange = (index, field, value) => {
        if (readOnly) return;
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        onChange({ ...data, rows: newRows });
    };

    const handleAddRow = () => {
        if (readOnly) return;
        const newRow = { description: 'New Item', quantity: 1, rate: 100 };
        onChange({ ...data, rows: [...rows, newRow] });
    };

    const handleRemoveRow = (index) => {
        if (readOnly || rows.length <= 1) return;
        const newRows = rows.filter((_, i) => i !== index);
        onChange({ ...data, rows: newRows });
    };

    const displayTitle = resolvedContext ? resolveVariables(data.title || '', resolvedContext) : data.title;

    return (
        <div className="w-full my-4 font-sans">
            {displayTitle && (
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
                    {displayTitle}
                </h4>
            )}

            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key || idx}
                                    style={{ width: col.width || 'auto' }}
                                    className={`py-3 px-4 ${col.type === 'number' || col.type === 'currency' || col.type === 'calculated' ? 'text-right' : 'text-left'}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {!readOnly && <th className="py-3 px-2 w-10 text-center"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {rows.map((row, rIdx) => {
                            const rowTotal = calculateRowTotal(row);
                            return (
                                <tr key={rIdx} className="group/row hover:bg-slate-50/60 transition-colors">
                                    {columns.map((col) => {
                                        if (col.type === 'calculated') {
                                            return (
                                                <td key={col.key} className="py-3 px-4 text-right font-medium text-slate-800">
                                                    {currency}{rowTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            );
                                        }

                                        if (col.type === 'number') {
                                            return (
                                                <td key={col.key} className="py-2 px-4 text-right">
                                                    <input
                                                        type="number"
                                                        disabled={readOnly}
                                                        value={row[col.key] ?? ''}
                                                        onChange={(e) => handleRowChange(rIdx, col.key, e.target.value)}
                                                        className="w-20 text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded px-1.5 py-1 text-slate-800 outline-none transition disabled:opacity-90"
                                                    />
                                                </td>
                                            );
                                        }

                                        if (col.type === 'currency') {
                                            return (
                                                <td key={col.key} className="py-2 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <span className="text-slate-400 text-xs">{currency}</span>
                                                        <input
                                                            type="number"
                                                            disabled={readOnly}
                                                            value={row[col.key] ?? ''}
                                                            onChange={(e) => handleRowChange(rIdx, col.key, e.target.value)}
                                                            className="w-24 text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded px-1.5 py-1 text-slate-800 outline-none transition disabled:opacity-90"
                                                        />
                                                    </div>
                                                </td>
                                            );
                                        }

                                        const cellVal = row[col.key] ?? '';
                                        const displayCellVal = resolvedContext ? resolveVariables(String(cellVal), resolvedContext) : cellVal;

                                        return (
                                            <td key={col.key} className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    disabled={readOnly}
                                                    value={displayCellVal}
                                                    onChange={(e) => handleRowChange(rIdx, col.key, e.target.value)}
                                                    placeholder="Item name / details"
                                                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded px-2 py-1 text-slate-800 outline-none transition disabled:opacity-90"
                                                />
                                            </td>
                                        );
                                    })}
                                    {!readOnly && (
                                        <td className="py-2 px-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRow(rIdx)}
                                                title="Delete row"
                                                className="opacity-0 group-hover/row:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Table Actions */}
            <div className="flex items-center justify-between mt-2 pt-1">
                {!readOnly ? (
                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-md transition"
                    >
                        <Plus size={14} />
                        Add Line Item
                    </button>
                ) : <div />}

                {showTotals && (
                    <div className="w-64 bg-slate-50/70 border border-slate-200/80 rounded-lg p-3 text-xs space-y-1.5">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-900">
                                {currency}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        {discountRate > 0 && (
                            <div className="flex justify-between text-emerald-600">
                                <span>Discount ({discountRate}%)</span>
                                <span>-{currency}{discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}

                        {taxRate > 0 && (
                            <div className="flex justify-between text-slate-600">
                                <span>Tax ({taxRate}%)</span>
                                <span>+{currency}{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}

                        <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
                            <span>Total Due</span>
                            <span className="text-indigo-600">
                                {currency}{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DynamicTableBlock;
