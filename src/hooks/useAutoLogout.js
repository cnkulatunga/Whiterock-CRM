import { useEffect, useRef, useCallback } from 'react';

const TIMEOUT_MS = 10 * 60 * 1000; // 1 hour in milliseconds

export const useAutoLogout = (onLogout, isActive) => {
    const timeoutRef = useRef(null);
    const lastActivityRef = useRef(Date.now());

    const checkAndResetTimeout = useCallback(() => {
        if (!isActive) return;

        // Throttle updates to avoid excessive timeout clearing
        const now = Date.now();
        if (now - lastActivityRef.current < 1000 && timeoutRef.current) {
            return;
        }
        lastActivityRef.current = now;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            onLogout();
        }, TIMEOUT_MS);
    }, [onLogout, isActive]);

    useEffect(() => {
        if (!isActive) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            return;
        }

        const events = [
            'mousemove',
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
            'click'
        ];

        // Initialize first timeout
        checkAndResetTimeout();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, checkAndResetTimeout, { passive: true });
        });

        // Setup an interval to check across tabs (optional, but good for robust session management)
        // For simplicity, we just rely on window events for now.

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, checkAndResetTimeout);
            });
        };
    }, [isActive, checkAndResetTimeout]);
};

export default useAutoLogout;
