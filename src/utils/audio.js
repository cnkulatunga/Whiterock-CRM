export const playReminderSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);

        // Second beep
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1108.73, audioContext.currentTime + 0.1); // C#6
            gain2.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
            gain2.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.start(audioContext.currentTime + 0.1);
            osc2.stop(audioContext.currentTime + 0.6);
        }, 150);
        
    } catch (e) {
        console.error("Audio API not supported or blocked", e);
    }
};
