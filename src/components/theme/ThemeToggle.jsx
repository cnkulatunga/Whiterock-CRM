import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const SunIcon = ({ size = 15 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = ({ size = 13 }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width={size} height={size}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const MonitorIcon = ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
);

const MODES = [
    { key: 'light',  label: 'Light',  Icon: SunIcon },
    { key: 'system', label: 'System', Icon: MonitorIcon },
    { key: 'dark',   label: 'Dark',   Icon: MoonIcon },
];

const ThemeToggle = ({ compact = false }) => {
    const { mode, setMode, theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const [hovered, setHovered] = useState(false);

    if (compact) {
        // Cycle through modes in collapsed sidebar
        const cycleMode = () => {
            const idx = MODES.findIndex(m => m.key === mode);
            setMode(MODES[(idx + 1) % MODES.length].key);
        };
        const CurrentIcon = MODES.find(m => m.key === mode)?.Icon || MonitorIcon;
        return (
            <button
                onClick={cycleMode}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                title={`Theme: ${mode} — click to cycle`}
                style={{
                    width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                    background: hovered
                        ? isDark ? 'rgba(96,128,248,0.2)' : 'rgba(40,85,232,0.08)'
                        : 'transparent',
                    color: isDark ? '#7a96fa' : '#8b97ba',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease', flexShrink: 0,
                }}
            >
                <CurrentIcon size={15} />
            </button>
        );
    }

    // Full 3-button pill selector
    const pillBg = isDark ? '#181c2e' : '#edf0fb';
    const pillBorder = isDark ? '#2c3568' : '#d8e0f4';

    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            width: '100%',
            background: pillBg,
            border: `1.5px solid ${pillBorder}`,
            borderRadius: '12px',
            padding: '3px',
            gap: '2px',
        }}>
            {MODES.map(({ key, label, Icon }) => {
                const isActive = mode === key;
                return (
                    <button
                        key={key}
                        onClick={() => setMode(key)}
                        title={`${label} mode`}
                        style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                            padding: '6px 8px',
                            borderRadius: '9px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: isActive ? 700 : 500,
                            fontFamily: 'inherit',
                            transition: 'all 0.2s ease',
                            background: isActive
                                ? isDark
                                    ? 'linear-gradient(135deg, #2855e8, #1a38b8)'
                                    : '#ffffff'
                                : 'transparent',
                            color: isActive
                                ? isDark ? '#ffffff' : '#2855e8'
                                : isDark ? '#546298' : '#7d8eb6',
                            boxShadow: isActive
                                ? isDark
                                    ? '0 2px 8px rgba(40,85,232,0.4)'
                                    : '0 1px 4px rgba(40,85,232,0.12)'
                                : 'none',
                        }}
                    >
                        <Icon size={13} />
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

export default ThemeToggle;
