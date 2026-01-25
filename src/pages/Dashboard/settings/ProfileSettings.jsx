import React, { useState, useEffect } from 'react';
import { updateProfile } from '../../../api/auth';
import { useAuth } from '../../../context/AuthContext';
import { SettingsSection, SettingsInput, SaveButton, SuccessMessage, ErrorMessage } from './SettingsComponents';

const ProfileSettings = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
            if (user.avatar_url) {
                setAvatarPreview(user.avatar_url);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSaved(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setSaved(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('email', formData.email);
        if (formData.password) {
            payload.append('password', formData.password);
            payload.append('password_confirmation', formData.password_confirmation);
        }
        if (avatarFile) {
            payload.append('avatar', avatarFile);
        }

        try {
            const updated = await updateProfile(payload);
            setSaved(true);
            setUser(updated.data); // Update global auth context
            setFormData(prev => ({ ...prev, password: '', password_confirmation: '' })); // Clear password fields
            setAvatarFile(null); // Clear file input
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl">
            {error && <ErrorMessage message={error} />}
            {saved && <div className="mb-4"><SuccessMessage message="Profile updated successfully." /></div>}

            <SettingsSection title="Personal Information" description="Manage your personal account details.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Picture */}
                    <div className="md:col-span-2 flex items-center gap-6">
                        <div className="relative group">
                            <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-2xl">
                                        {formData.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full text-white text-xs font-medium">
                                Change
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-800">Profile Picture</h4>
                            <p className="text-xs text-slate-500 mt-1">
                                Upload a JPG or PNG. Max size 2MB.
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <SettingsInput
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <SettingsInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Security" description="Update your password (leave blank to keep current).">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsInput
                        label="New Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                    />
                    <SettingsInput
                        label="Confirm Password"
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                    />
                </div>
            </SettingsSection>

            <div className="flex justify-end pt-2">
                <SaveButton loading={loading} saved={saved} label="Update Profile" />
            </div>
        </form>
    );
};

export default ProfileSettings;
