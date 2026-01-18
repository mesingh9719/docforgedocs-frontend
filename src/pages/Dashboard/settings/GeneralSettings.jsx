import React, { useState, useEffect } from 'react';
import { updateBusiness } from '../../../api/business';
import { SettingsSection, SettingsInput, SaveButton, SuccessMessage, ErrorMessage } from './SettingsComponents';

const GeneralSettings = ({ business, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        industry: '',
        social_links: {
            linkedin: '',
            twitter: '',
            facebook: '',
            instagram: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || '',
                email: business.email || '',
                phone: business.phone || '',
                website: business.website || '',
                address: business.address || '',
                city: business.city || '',
                state: business.state || '',
                zip: business.zip || '',
                country: business.country || '',
                industry: business.industry || '',
                social_links: business.social_links || { linkedin: '', twitter: '', facebook: '', instagram: '' }
            });
        }
    }, [business]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const socialKey = name.replace('social_', '');
            setFormData(prev => ({
                ...prev,
                social_links: { ...prev.social_links, [socialKey]: value }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
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
            {saved && <div className="mb-4"><SuccessMessage message="Settings updated successfully." /></div>}

            <SettingsSection title="Business Information" description="Basic contact information for your business.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <SettingsInput
                            label="Business Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <SettingsInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <SettingsInput
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <div className="md:col-span-2">
                        <SettingsInput
                            label="Website"
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Address Details" description="Your business physical location.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <SettingsInput
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <SettingsInput label="City" name="city" value={formData.city} onChange={handleChange} />
                    <SettingsInput label="State" name="state" value={formData.state} onChange={handleChange} />
                    <SettingsInput label="Zip / Postal Code" name="zip" value={formData.zip} onChange={handleChange} />
                    <SettingsInput label="Country" name="country" value={formData.country} onChange={handleChange} />
                </div>
            </SettingsSection>

            <SettingsSection title="Social Profiles" description="Connect your social media accounts.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsInput
                        label="LinkedIn"
                        type="url"
                        name="social_linkedin"
                        value={formData.social_links?.linkedin || ''}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/..."
                    />
                    <SettingsInput
                        label="Twitter (X)"
                        type="url"
                        name="social_twitter"
                        value={formData.social_links?.twitter || ''}
                        onChange={handleChange}
                        placeholder="https://twitter.com/..."
                    />
                    <SettingsInput
                        label="Facebook"
                        type="url"
                        name="social_facebook"
                        value={formData.social_links?.facebook || ''}
                        onChange={handleChange}
                        placeholder="https://facebook.com/..."
                    />
                    <SettingsInput
                        label="Instagram"
                        type="url"
                        name="social_instagram"
                        value={formData.social_links?.instagram || ''}
                        onChange={handleChange}
                        placeholder="https://instagram.com/..."
                    />
                </div>
            </SettingsSection>

            <div className="flex justify-end pt-2">
                <SaveButton loading={loading} saved={saved} />
            </div>
        </form>
    );
};

export default GeneralSettings;
