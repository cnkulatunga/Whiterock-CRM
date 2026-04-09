const DB_NAME = 'WhiterockCRM_DB';
const DB_VERSION = 1;
const STORE_NAME = 'kb_resources';

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

export const saveResources = async (resources) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // Clear existing to keep it simple and sync-like
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = () => {
            let count = 0;
            if (resources.length === 0) resolve();
            
            resources.forEach(resource => {
                const addRequest = store.add(resource);
                addRequest.onsuccess = () => {
                    count++;
                    if (count === resources.length) resolve();
                };
                addRequest.onerror = (e) => reject(e.target.error);
            });
        };
        
        clearRequest.onerror = (e) => reject(e.target.error);
    });
};

export const getResources = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
};
