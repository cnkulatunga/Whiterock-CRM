import MockAdapter from 'axios-mock-adapter';
import api from './api';
import { MOCK_LEADS, SHARED_INITIAL_USERS, INITIAL_TASKS, FULL_LENDERS_LIST } from '../data/dummyData';

// This file intercepts all outgoing axios requests from api.js and returns
// dummy data. This allows the frontend to be fully wired up using crmApi.js
// while the backend developer builds the real MongoDB endpoints.

const mock = new MockAdapter(api, { delayResponse: 500 });

// ------------- USERS MOCK _____________
let usersDB = [...SHARED_INITIAL_USERS];

mock.onGet('/users').reply(() => [200, usersDB]);

mock.onPost('/users').reply(config => {
    const data = JSON.parse(config.data);
    const newUser = { id: Date.now(), ...data };
    usersDB.unshift(newUser);
    return [201, newUser];
});


// ------------- LEADS MOCK _____________
// Use localStorage as a persistence layer inside the mock so page reloads don't reset data
let leadsDB = [];
try {
    const saved = localStorage.getItem('crm_leads_mock_db');
    if (saved) leadsDB = JSON.parse(saved);
    else {
        leadsDB = [...MOCK_LEADS];
        localStorage.setItem('crm_leads_mock_db', JSON.stringify(leadsDB));
    }
} catch (e) {
    leadsDB = [...MOCK_LEADS];
}

const saveLeads = () => localStorage.setItem('crm_leads_mock_db', JSON.stringify(leadsDB));

mock.onGet('/leads').reply(() => [200, leadsDB]);

mock.onPost('/leads').reply(config => {
    const data = JSON.parse(config.data);
    const newId = `AF-${String(leadsDB.length + 1).padStart(3, '0')}`;
    const newLead = { id: newId, leadId: newId, ...data, submissionDate: new Date().toISOString() };
    leadsDB.unshift(newLead);
    saveLeads();
    return [201, newLead];
});

mock.onPut(/\/leads\/.+/).reply(config => {
    const id = config.url.split('/').pop();
    const data = JSON.parse(config.data);
    const idx = leadsDB.findIndex(l => l.id === id);
    if (idx >= 0) {
        leadsDB[idx] = { ...leadsDB[idx], ...data };
        saveLeads();
        return [200, leadsDB[idx]];
    }
    return [404, { message: 'Lead not found' }];
});

mock.onDelete(/\/leads\/.+/).reply(config => {
    const id = config.url.split('/').pop();
    leadsDB = leadsDB.filter(l => l.id !== id);
    saveLeads();
    return [200, { success: true }];
});

// ------------- TASKS MOCK _____________
let tasksDB = [...INITIAL_TASKS];

mock.onGet('/tasks').reply(() => [200, tasksDB]);

mock.onPost('/tasks').reply(config => {
    const data = JSON.parse(config.data);
    const newTask = { id: Date.now(), ...data };
    tasksDB.unshift(newTask);
    return [201, newTask];
});

mock.onPut(/\/tasks\/.+/).reply(config => {
    const id = parseInt(config.url.split('/').pop());
    const data = JSON.parse(config.data);
    tasksDB = tasksDB.map(t => t.id === id ? { ...t, ...data } : t);
    return [200, tasksDB.find(t => t.id === id)];
});

mock.onDelete(/\/tasks\/.+/).reply(config => {
    const id = parseInt(config.url.split('/').pop());
    tasksDB = tasksDB.filter(t => t.id !== id);
    return [200, { success: true }];
});


// ------------- LENDERS MOCK _____________
let lendersDB = [...FULL_LENDERS_LIST];

mock.onGet('/lenders').reply(() => [200, lendersDB]);

// Pass through any unrecognized requests just in case
mock.onAny().passThrough();

export default mock;
