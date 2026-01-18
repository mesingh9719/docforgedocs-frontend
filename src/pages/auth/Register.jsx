import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import AuthLayout from '../../components/auth/AuthLayout';

function Register() {
    return (
        <AuthLayout
            title="Start your journey"
            subtitle="Join thousands of businesses managing documents with ease."
        >
            <RegisterForm />
        </AuthLayout>
    );
}

export default Register;
