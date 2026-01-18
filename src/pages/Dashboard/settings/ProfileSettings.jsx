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

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSaved(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            name: formData.name,
            email: formData.email,
        };

        if (formData.password) {
            payload.password = formData.password;
            payload.password_confirmation = formData.password_confirmation;
        }

        try {
            const updated = await updateProfile(payload);
            setSaved(true);
            setUser(updated.data); // Update global auth context
            setFormData(prev => ({ ...prev, password: '', password_confirmation: '' })); // Clear password fields
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
