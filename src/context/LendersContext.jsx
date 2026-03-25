import React, { createContext, useContext, useState, useEffect } from 'react';
import { FULL_LENDERS_LIST as INITIAL_LENDERS } from '../data/dummyData';

const LendersContext = createContext(null);

export const LendersProvider = ({ children }) => {
    const [lenders, setLenders] = useState(() => {
        const savedLenders = localStorage.getItem('lenders');
        return savedLenders ? JSON.parse(savedLenders) : INITIAL_LENDERS;
    });

    useEffect(() => {
        localStorage.setItem('lenders', JSON.stringify(lenders));
    }, [lenders]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'lenders' && e.newValue) {
                setLenders(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addLender = (lender) => {
        setLenders(prev => [...prev, { ...lender, id: Date.now() }]);
    };

    const updateLender = (id, updatedLender) => {
        setLenders(prev => prev.map(l => l.id === id ? { ...l, ...updatedLender } : l));
    };

    const deleteLender = (id) => {
        setLenders(prev => prev.filter(l => l.id !== id));
    };

    return (
        <LendersContext.Provider value={{ lenders, addLender, updateLender, deleteLender }}>
            {children}
        </LendersContext.Provider>
    );
};

export const useLenders = () => {
    const context = useContext(LendersContext);
    if (!context) {
        throw new Error('useLenders must be used within a LendersProvider');
    }
    return context;
};
