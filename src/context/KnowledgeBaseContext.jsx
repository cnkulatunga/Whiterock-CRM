import React, { createContext, useContext, useState, useEffect } from 'react';
import { KNOWLEDGE_BASE_RESOURCES } from '../data/dummyData';
import { getResources, saveResources } from '../services/dbService';

const KnowledgeBaseContext = createContext();

export const useKnowledgeBase = () => {
    const context = useContext(KnowledgeBaseContext);
    if (!context) {
        throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
    }
    return context;
};

export const KnowledgeBaseProvider = ({ children }) => {
    const [resources, setResources] = useState(KNOWLEDGE_BASE_RESOURCES);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        getResources().then(saved => {
            if (saved && saved.length > 0) {
                setResources(saved);
            }
            setIsLoaded(true);
        }).catch(err => {
            console.error('Failed to load KB from IndexedDB:', err);
            setIsLoaded(true);
        });
    }, []);

    // Save on change
    useEffect(() => {
        if (!isLoaded) return;
        saveResources(resources).catch(err => {
            console.error('Failed to save KB to IndexedDB:', err);
        });
    }, [resources, isLoaded]);

    const addResource = (resource) => {
        setResources(prev => [resource, ...prev]);
    };

    const deleteResource = (id) => {
        setResources(prev => prev.filter(r => r.id !== id));
    };

    return (
        <KnowledgeBaseContext.Provider value={{ resources, addResource, deleteResource }}>
            {children}
        </KnowledgeBaseContext.Provider>
    );
};
