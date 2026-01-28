import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const AuthInput = forwardRef(({ icon: Icon, name, type, value, onChange, placeholder, error, disabled }, ref) => {
    return (
        <div className="relative group">
            <Icon
                className={`absolute left-4 top-3.5 transition-colors duration-200 ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-600'
                    }`}
                size={20}
            />
            <input
                ref={ref}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl block w-full pl-12 p-3.5 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${error
                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-red-50/10'
                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 hover:border-slate-300'
                    }`}
            />
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-4 top-3.5 text-red-500 pointer-events-none"
                    >
                        <AlertCircle size={20} />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-xs mt-1.5 ml-1 font-medium pl-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
});

AuthInput.displayName = 'AuthInput';

export default AuthInput;
