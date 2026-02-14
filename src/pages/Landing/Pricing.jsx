import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/contact');
    }, [navigate]);

    return null;
};

export default Pricing;
