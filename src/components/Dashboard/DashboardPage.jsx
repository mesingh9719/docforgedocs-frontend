import React from 'react';
import { motion } from 'framer-motion';

const DashboardPage = ({ children, className = '' }) => {
    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default DashboardPage;
