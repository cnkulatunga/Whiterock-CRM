import { useState, useEffect, useRef, useCallback } from 'react';
import { playReminderSound } from '../utils/audio';

export const useReminders = (tasks, setTasks) => {
    const [notifications, setNotifications] = useState([]);
    const [activeAlerts, setActiveAlerts] = useState([]); // For central modals
    const triggeredReminders = useRef(new Set());

    useEffect(() => {
        // Request browser notification permission
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const dismissAlert = useCallback((id) => {
        setActiveAlerts(prev => prev.filter(a => a.id !== id));
    }, []);

    const addNotification = useCallback((title, message, type = 'info', task = null) => {
        const id = Date.now();
        const notification = { id, title, message, type };
        setNotifications(prev => [...prev, notification]);
        
        // Auto-remove after 6 seconds for non-triggers
        if (type !== 'reminder') {
            setTimeout(() => removeNotification(id), 6000);
        } else if (task) {
            // If it's a reminder trigger, also show the central modal
            setActiveAlerts(prev => [...prev, { ...task, id }]);
        }
        
        // Browser notification if permitted
        if ("Notification" in window && Notification.permission === "granted" && type === 'reminder') {
            new Notification(title, { body: message, icon: '/favicon.ico' });
        }
        
        // Play sound for all reminder-related notifications
        playReminderSound();
        
        return id;
    }, [removeNotification]);

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            
            tasks.forEach(task => {
                if (task.reminder === 'none' || task.status === 'Completed') return;

                const taskTime = new Date(`${task.date}T${task.time}`);
                let triggerTime = new Date(taskTime);

                if (task.reminder === '15m') triggerTime.setMinutes(taskTime.getMinutes() - 15);
                else if (task.reminder === '1h') triggerTime.setHours(taskTime.getHours() - 1);
                else if (task.reminder === '1d') triggerTime.setDate(taskTime.getDate() - 1);

                const reminderId = `${task.id}-${task.reminder}`;

                // Check if it's time to trigger (within current minute)
                if (triggerTime <= now && !triggeredReminders.current.has(reminderId)) {
                    // Only trigger if it's somewhat recent (within last 30 minutes to avoid flood if someone opens after hours)
                    const diffMinutes = Math.floor((now - triggerTime) / 60000);
                    if (diffMinutes < 30) {
                        const displayMessage = task.message || `Scheduled for ${task.time} with ${task.lead || 'client'}.`;
                        addNotification(
                            `Reminder: ${task.title}`, 
                            displayMessage,
                            'reminder',
                            task
                        );
                        triggeredReminders.current.add(reminderId);
                    } else {
                        // Mark as triggered anyway so it doesn't bother the user again
                        triggeredReminders.current.add(reminderId);
                    }
                }
            });
        };

        const interval = setInterval(checkReminders, 15000); // Check every 15 seconds
        checkReminders(); // Initial check

        return () => clearInterval(interval);
    }, [tasks, addNotification]);

    // Manual notification trigger for "Reminder Set"
    const notifyReminderSet = useCallback((task) => {
        if (task.reminder !== 'none') {
            const timeLabel = task.reminder === '1d' ? '1 day before' : task.reminder === '1h' ? '1 hour before' : '15 min before';
            addNotification(
                'Reminder Set', 
                `Alert scheduled for "${task.title}" (${timeLabel})`,
                'info'
            );
        }
    }, [addNotification]);

    return { notifications, activeAlerts, addNotification, notifyReminderSet, removeNotification, dismissAlert };
};

