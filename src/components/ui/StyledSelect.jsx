import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function StyledSelect({ 
    value, 
    onChange, 
    options, 
    placeholder = 'Select...', 
    icon: Icon,
    className = '' 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div ref={selectRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between gap-2
                    bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4
                    text-sm text-white transition-all duration-200
                    hover:border-zinc-700 focus:outline-none focus:border-red-400/50
                    ${isOpen ? 'border-red-400/50 ring-2 ring-red-400/10' : ''}
                `}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
                    <span className={selectedOption ? 'text-white' : 'text-zinc-500'}>
                        {selectedOption?.label || placeholder}
                    </span>
                </div>
                <ChevronDown 
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute z-50 w-full mt-2 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/20 overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center justify-between gap-2 px-4 py-2.5
                                        text-sm transition-colors text-left
                                        ${option.value === value 
                                            ? 'bg-red-500/10 text-red-400' 
                                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        {option.icon && <option.icon className="w-4 h-4" />}
                                        <span>{option.label}</span>
                                    </div>
                                    {option.value === value && (
                                        <Check className="w-4 h-4 text-red-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
