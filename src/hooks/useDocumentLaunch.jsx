import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthRequiredModal from '../components/LandingPage/AuthRequiredModal';

const TEMPLATE_ROUTE_MAP = {
    nda: '/documents/nda',
    proposal: '/documents/proposal',
    'business-proposal': '/documents/proposal',
    'consulting-agreement': '/documents/consulting-agreement',
    invoice: '/documents/invoice',
    'invoice-generator': '/documents/invoice',
    'offer-letter': '/documents/offer-letter',
    signature: '/signatures',
    'electronic-signature': '/signatures'
};

export const useDocumentLaunch = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [authModalState, setAuthModalState] = useState({
        isOpen: false,
        templateId: 'nda'
    });

    const launchDocument = useCallback((templateId = 'nda') => {
        const targetRoute = TEMPLATE_ROUTE_MAP[templateId] || '/documents';

        if (token) {
            navigate(targetRoute);
        } else {
            setAuthModalState({
                isOpen: true,
                templateId
            });
        }
    }, [token, navigate]);

    const closeAuthModal = useCallback(() => {
        setAuthModalState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const AuthModalComponent = useCallback(() => (
        <AuthRequiredModal
            isOpen={authModalState.isOpen}
            onClose={closeAuthModal}
            templateId={authModalState.templateId}
        />
    ), [authModalState.isOpen, authModalState.templateId, closeAuthModal]);

    return {
        launchDocument,
        authModalState,
        closeAuthModal,
        AuthModalComponent
    };
};
