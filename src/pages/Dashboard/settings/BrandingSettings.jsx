import React, { useState, useEffect } from 'react';
import { updateBusiness } from '../../../api/business';
import { Upload, AlertCircle } from 'lucide-react';
import { SettingsSection, SaveButton, SuccessMessage, ErrorMessage } from './SettingsComponents';

const BrandingSettings = ({ business, onUpdate }) => {
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [favicon, setFavicon] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (business) {
            if (business.logo) setLogoPreview(business.logo);
            if (business.favicon) setFaviconPreview(business.favicon);
        }
    }, [business]);

    const handleFileChange = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setSaved(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        if (logo) formData.append('logo', logo);
        if (favicon) formData.append('favicon', favicon);

        if (!logo && !favicon) {
            setLoading(false);
            // Just show success if no changes, or maybe info
            return;
        }

        try {
            const updated = await updateBusiness(formData);
            onUpdate(updated.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            setLogo(null);
            setFavicon(null);
        } catch (error) {
            console.error(error);
            setError('Failed to update branding settings');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${url}`;
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl">
            {error && <ErrorMessage message={error} />}
            {saved && <div className="mb-4"><SuccessMessage message="Branding settings updated successfully." /></div>}

            <SettingsSection title="Brand Assets" description="Upload your business logo and favicon.">
                <div className="space-y-8">
                    {/* Logo Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Business Logo</label>
                        <div className="flex items-start gap-6">
                            <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 relative group transition-all hover:border-indigo-400">
                                {logoPreview ? (
                                    <img src={getImageUrl(logoPreview)} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <span className="text-slate-400 text-xs font-medium">No Logo</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="logo-upload"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setLogo, setLogoPreview)}
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Logo
                                </label>
                                <p className="mt-2 text-xs text-slate-500">
                                    Recommended size: 512x512px. Max file size: 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-6"></div>

                    {/* Favicon Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Favicon</label>
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 transition-all hover:border-indigo-400">
                                {faviconPreview ? (
                                    <img src={getImageUrl(faviconPreview)} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                                ) : (
                                    <span className="text-slate-400 text-xs font-medium">No Icon</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/x-icon,image/png,image/jpeg,image/svg+xml"
                                    id="favicon-upload"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setFavicon, setFaviconPreview)}
                                />
                                <label
                                    htmlFor="favicon-upload"
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Favicon
                                </label>
                                <p className="mt-2 text-xs text-slate-500">
                                    Recommended size: 32x32px or 16x16px. Formats: .ico, .png, .svg.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsSection>

            <div className="flex justify-end pt-2">
                <SaveButton loading={loading} saved={saved} disabled={!logo && !favicon} label="Save Branding" />
            </div>
        </form>
    );
};

export default BrandingSettings;
