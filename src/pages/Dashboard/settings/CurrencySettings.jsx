import React, { useState, useEffect } from 'react';
import { updateBusiness } from '../../../api/business';
import { SettingsSection, SettingsInput, SaveButton, SuccessMessage, ErrorMessage } from './SettingsComponents';

const CurrencySettings = ({ business, onUpdate }) => {
    const [formData, setFormData] = useState({
        currency_symbol: '',
        currency_code: '',
        currency_country: '',
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (business) {
            setFormData({
                currency_symbol: business.currency_symbol || '',
                currency_code: business.currency_code || '',
                currency_country: business.currency_country || '',
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
            {saved && <div className="mb-4"><SuccessMessage message="Currency settings updated successfully." /></div>}

            <SettingsSection title="Currency & Region" description="Set your preferred currency for invoices and financial reports.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SettingsInput
                        label="Currency Code"
                        name="currency_code"
                        value={formData.currency_code}
                        onChange={handleChange}
                        placeholder="USD"
                    />

                    <SettingsInput
                        label="Symbol"
                        name="currency_symbol"
                        value={formData.currency_symbol}
                        onChange={handleChange}
                        placeholder="$"
                    />

                    <SettingsInput
                        label="Country"
                        name="currency_country"
                        value={formData.currency_country}
                        onChange={handleChange}
                        placeholder="United States"
                    />
                </div>
            </SettingsSection>

            <div className="flex justify-end pt-2">
                <SaveButton loading={loading} saved={saved} />
            </div>
        </form>
    );
};

export default CurrencySettings;
