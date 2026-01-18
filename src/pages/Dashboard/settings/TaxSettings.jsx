import React, { useState, useEffect } from 'react';
import { updateBusiness } from '../../../api/business';
import { SettingsSection, SettingsInput, SaveButton, SuccessMessage, ErrorMessage } from './SettingsComponents';

const TaxSettings = ({ business, onUpdate }) => {
    const [formData, setFormData] = useState({
        tax_label: '',
        tax_percentage: '',
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (business) {
            setFormData({
                tax_label: business.tax_label || '',
                tax_percentage: business.tax_percentage || '',
            });
        }
    }, [business]);

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
                    <SettingsInput
                        label="Tax Label"
                        name="tax_label"
                        value={formData.tax_label}
                        onChange={handleChange}
                        placeholder="VAT, GST, HST"
                    />

                    <SettingsInput
                        label="Tax Percentage (%)"
                        type="number"
                        step="0.01"
                        name="tax_percentage"
                        value={formData.tax_percentage}
                        onChange={handleChange}
                        placeholder="0.00"
                    />
                </div>
            </SettingsSection>

            <div className="flex justify-end pt-2">
                <SaveButton loading={loading} saved={saved} />
            </div>
        </form>
    );
};

export default TaxSettings;
