import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/auth/AuthLayout';

function Login() {
    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your details to access your workspace."
        >
            <LoginForm />
        </AuthLayout>
    );
}

export default Login;
