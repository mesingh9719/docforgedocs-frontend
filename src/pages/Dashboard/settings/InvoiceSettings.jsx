import React, { useState, useEffect } from 'react';
import { updateBusiness } from '../../../api/business';
import { SettingsSection, SettingsInput, SettingsTextarea, SaveButton, SuccessMessage, ErrorMessage } from './SettingsComponents';

const InvoiceSettings = ({ business, onUpdate, canEdit = true }) => {
    const [formData, setFormData] = useState({
        invoice_prefix: '',
        invoice_terms: '',
        default_invoice_notes: '',
        bank_details: {
            account_name: '',
            bank_name: '',
            account_number: '',
            ifsc_code: '', // Can be IBAN/SWIFT
            swift_code: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (business) {
            setFormData({
                invoice_prefix: business.invoice_prefix || '',
                invoice_terms: business.invoice_terms || '',
                default_invoice_notes: business.default_invoice_notes || '',
                bank_details: business.bank_details || {
                    account_name: '',
                    bank_name: '',
                    account_number: '',
                    ifsc_code: '',
                    swift_code: ''
                }
            });
        }
    }, [business]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('bank_')) {
            const bankKey = name.replace('bank_', '');
            setFormData(prev => ({
                ...prev,
                bank_details: { ...prev.bank_details, [bankKey]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setSaved(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const updated = await updateBusiness(formData);
            onUpdate(updated.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl">
            {error && <ErrorMessage message={error} />}
            {saved && <div className="mb-4"><SuccessMessage message="Invoice settings updated successfully." /></div>}

            <SettingsSection title="General Configuration" description="Set your invoice number prefix.">
                <div>
                    <SettingsInput
                        label="Invoice Prefix"
                        name="invoice_prefix"
                        value={formData.invoice_prefix}
                        onChange={handleChange}
                        placeholder="INV-"
                        disabled={!canEdit}
                    />
                    <p className="mt-2 text-xs text-slate-500">Prefix for invoice numbers (e.g., INV-0001)</p>
                </div>
            </SettingsSection>

            <SettingsSection title="Bank Account Details" description="These details will be displayed on invoices for payments.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <SettingsInput
                            label="Account Name / Beneficiary Name"
                            name="bank_account_name"
                            value={formData.bank_details?.account_name || ''}
                            onChange={handleChange}
                            disabled={!canEdit}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <SettingsInput
                            label="Bank Name"
                            name="bank_bank_name"
                            value={formData.bank_details?.bank_name || ''}
                            onChange={handleChange}
                            disabled={!canEdit}
                        />
                    </div>
                    <SettingsInput
                        label="Account Number / IBAN"
                        name="bank_account_number"
                        value={formData.bank_details?.account_number || ''}
                        onChange={handleChange}
                        disabled={!canEdit}
                    />
                    <SettingsInput
                        label="IFSC / SWIFT Code"
                        name="bank_ifsc_code"
                        value={formData.bank_details?.ifsc_code || ''}
                        onChange={handleChange}
                        disabled={!canEdit}
                    />
                </div>
            </SettingsSection>

            <SettingsSection title="Defaults" description="Default texts for new invoices.">
                <div className="space-y-6">
                    <SettingsTextarea
                        label="Default Terms & Conditions"
                        name="invoice_terms"
                        rows={4}
                        value={formData.invoice_terms}
                        onChange={handleChange}
                        placeholder="e.g. Payment due within 30 days..."
                        disabled={!canEdit}
                    />
                    <SettingsTextarea
                        label="Default Invoice Notes"
                        name="default_invoice_notes"
                        rows={2}
                        value={formData.default_invoice_notes}
                        onChange={handleChange}
                        placeholder="e.g. Thank you for your business!"
                        disabled={!canEdit}
                    />
                </div>
            </SettingsSection>

            <div className="flex justify-end pt-2">
                <SaveButton loading={loading} saved={saved} disabled={!canEdit} />
            </div>
        </form>
    );
};

export default InvoiceSettings;
