import React, { createContext, useContext, useState, useEffect } from 'react';

const PromotionsContext = createContext(null);

export const PromotionsProvider = ({ children }) => {
    const [promotions, setPromotions] = useState(() => {
        const savedPromotions = localStorage.getItem('lender_promotions');
        return savedPromotions ? JSON.parse(savedPromotions) : [];
    });

    useEffect(() => {
        localStorage.setItem('lender_promotions', JSON.stringify(promotions));
    }, [promotions]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'lender_promotions' && e.newValue) {
                setPromotions(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addPromotion = (promotion) => {
        setPromotions(prev => [{ ...promotion, id: Date.now().toString() }, ...prev]);
    };

    const updatePromotion = (id, updatedPromotion) => {
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...updatedPromotion } : p));
    };

    const deletePromotion = (id) => {
        setPromotions(prev => prev.filter(p => p.id !== id));
    };

    return (
        <PromotionsContext.Provider value={{ promotions, addPromotion, updatePromotion, deletePromotion }}>
            {children}
        </PromotionsContext.Provider>
    );
};

export const usePromotions = () => {
    const context = useContext(PromotionsContext);
    if (!context) {
        throw new Error('usePromotions must be used within a PromotionsProvider');
    }
    return context;
};
