import React, { useState, useEffect } from 'react';
import { updateBusiness } from '../../../api/business';
import axios from '../../../api/axios';
import { SettingsSection, SettingsInput, SaveButton, SuccessMessage, ErrorMessage } from './SettingsComponents';

const CurrencySettings = ({ business, onUpdate, canEdit = true }) => {
    const [formData, setFormData] = useState({
        currency_symbol: '',
        currency_code: '',
        currency_country: '',
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('/currencies');
                setCurrencies(response.data.data);
            } catch (err) {
                console.error("Failed to load currencies", err);
            } finally {
                setLoadingCurrencies(false);
            }
        };

        fetchCurrencies();

        if (business) {
            setFormData({
                currency_symbol: business.currency_symbol || '',
                currency_code: business.currency_code || '',
                currency_country: business.currency_country || '',
            });
        }
    }, [business]);

    const handleCurrencySelect = (e) => {
        const selectedCode = e.target.value;
        const selectedCurrency = currencies.find(c => c.code === selectedCode);

        if (selectedCurrency) {
            setFormData({
                ...formData,
                currency_code: selectedCurrency.code,
                currency_symbol: selectedCurrency.symbol,
                currency_country: selectedCurrency.name, // Or map to country name if available in currency object
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
            {saved && <div className="mb-4"><SuccessMessage message="Currency settings updated successfully." /></div>}

            <SettingsSection title="Currency & Region" description="Set your preferred currency for invoices and financial reports.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                        <select
                            name="currency_code"
                            value={formData.currency_code}
                            onChange={handleCurrencySelect}
                            className={`w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm ${!canEdit ? 'opacity-70 bg-slate-100 cursor-not-allowed' : ''}`}
                            disabled={loadingCurrencies || !canEdit}
                        >
                            <option value="">Select Currency</option>
                            {currencies.map((currency) => (
                                <option key={currency.id} value={currency.code}>
                                    {currency.code} - {currency.name} ({currency.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    <SettingsInput
                        label="Symbol"
                        name="currency_symbol"
                        value={formData.currency_symbol}
                        onChange={handleChange}
                        placeholder="$"
                        disabled={true} // Read-only as it's auto-selected
                    />

                    <SettingsInput
                        label="Country"
                        name="currency_country"
                        value={formData.currency_country}
                        onChange={handleChange}
                        placeholder="United States"
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

export default CurrencySettings;
