import React, { createContext, useContext, useState, useEffect } from 'react';
import { KNOWLEDGE_BASE_RESOURCES } from '../data/dummyData';

const KnowledgeBaseContext = createContext();

export const useKnowledgeBase = () => {
    const context = useContext(KnowledgeBaseContext);
    if (!context) {
        throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
    }
    return context;
};

export const KnowledgeBaseProvider = ({ children }) => {
    const [resources, setResources] = useState(() => {
        const saved = localStorage.getItem('kb_resources');
        return saved ? JSON.parse(saved) : KNOWLEDGE_BASE_RESOURCES;
    });

    useEffect(() => {
        localStorage.setItem('kb_resources', JSON.stringify(resources));
    }, [resources]);

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
