import React, { useState, useEffect } from 'react';
import { updateBusiness } from '../../../api/business';
import axios from '../../../api/axios';
import { SettingsSection, SettingsInput, SaveButton, SuccessMessage, ErrorMessage } from './SettingsComponents';

const TaxSettings = ({ business, onUpdate, canEdit = true }) => {
    const [formData, setFormData] = useState({
        tax_label: '',
        tax_percentage: '',
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [taxRates, setTaxRates] = useState([]);
    const [loadingTaxes, setLoadingTaxes] = useState(true);

    useEffect(() => {
        const fetchTaxRates = async () => {
            try {
                const response = await axios.get('/tax-rates');
                setTaxRates(response.data.data);
            } catch (err) {
                console.error("Failed to load tax rates", err);
            } finally {
                setLoadingTaxes(false);
            }
        };

        fetchTaxRates();

        if (business) {
            setFormData({
                tax_label: business.tax_label || '',
                tax_percentage: business.tax_percentage || '',
            });
        }
    }, [business]);

    const handleTaxSelect = (e) => {
        // Find selected tax based on label (name) or another unique identifier if available.
        // Assuming user selects a tax name here for 'tax_label'.
        const selectedName = e.target.value;
        const selectedTax = taxRates.find(t => t.name === selectedName);

        if (selectedTax) {
            setFormData({
                ...formData,
                tax_label: selectedTax.name,
                tax_percentage: selectedTax.rate,
            });
        }
        setSaved(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            {saved && <div className="mb-4"><SuccessMessage message="Tax settings updated successfully." /></div>}

            <SettingsSection title="Tax Configuration" description="Configure your tax settings for invoices.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tax Type</label>
                        <select
                            name="tax_label"
                            value={formData.tax_label}
                            onChange={handleTaxSelect}
                            className={`w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm ${!canEdit ? 'opacity-70 bg-slate-100 cursor-not-allowed' : ''}`}
                            disabled={loadingTaxes || !canEdit}
                        >
                            <option value="">Select Tax</option>
                            {taxRates.map((tax) => (
                                <option key={tax.id} value={tax.name}>
                                    {tax.name} ({Number(tax.rate).toFixed(2)}%)
                                </option>
                            ))}
                        </select>
                    </div>

                    <SettingsInput
                        label="Tax Percentage (%)"
                        type="number"
                        step="0.01"
                        name="tax_percentage"
                        value={formData.tax_percentage}
                        onChange={handleChange}
                        placeholder="0.00"
                        disabled={true} // Read-only
                    />
                </div>
            </SettingsSection>

            <div className="flex justify-end pt-2">
                <SaveButton loading={loading} saved={saved} disabled={!canEdit} />
            </div>
        </form>
    );
};

export default TaxSettings;
