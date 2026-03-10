import { useState, useEffect, useRef, useCallback } from 'react';
import { playReminderSound } from '../utils/audio';

export const useReminders = (tasks, setTasks) => {
    const [notifications, setNotifications] = useState([]);
    const triggeredReminders = useRef(new Set());

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((title, message, type = 'info') => {
        const id = Date.now();
        const notification = { id, title, message, type };
        setNotifications(prev => [...prev, notification]);
        
        // Auto-remove after 6 seconds
        setTimeout(() => removeNotification(id), 6000);
        
        // Play sound for all reminder-related notifications
        playReminderSound();
        
        return id;
    }, [removeNotification]);


    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
            const currentDate = now.getDate().toString().padStart(2, '0');
            const currentHours = now.getHours().toString().padStart(2, '0');
            const currentMinutes = now.getMinutes().toString().padStart(2, '0');

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
                        addNotification(
                            'Reminder', 
                            `${task.title} (scheduled for ${task.time} with ${task.lead})`,
                            'reminder'
                        );
                        triggeredReminders.current.add(reminderId);
                    } else if (diffMinutes >= 30) {
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
            addNotification(
                'Reminder Set', 
                `Notifications enabled for "${task.title}" at ${task.time}`,
                'info'
            );
        }
    }, [addNotification]);

    return { notifications, addNotification, notifyReminderSet, removeNotification };
};
