import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { Theme } from '../../types/lesson';
import './Settings.css';

const Settings: React.FC = () => {
    const { progress, updateProgress } = useProgress();
    const { theme, setTheme } = useTheme();

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        updateProgress(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                currentTheme: newTheme
            }
        }));
    };

    const toggleAudio = () => {
        updateProgress(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                audioEnabled: !prev.settings.audioEnabled
            }
        }));
    };

    const toggleMicrophone = () => {
        updateProgress(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                microphoneEnabled: !prev.settings.microphoneEnabled
            }
        }));
    };

    return (
        <div className="settings container">
            <h1>Settings</h1>

            <div className="settings-section card">
                <h2>🎨 Choose Your Theme</h2>
                <p className="section-description">Pick your favorite theme for the app!</p>

                <div className="theme-grid">
                    <button
                        className={`theme-button ${theme === 'kpop' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('kpop')}
                    >
                        <span className="theme-icon">🎤</span>
                        <span className="theme-name">K-pop</span>
                    </button>

                    <button
                        className={`theme-button ${theme === 'harry_potter' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('harry_potter')}
                    >
                        <span className="theme-icon">🦉</span>
                        <span className="theme-name">Harry Potter</span>
                    </button>

                    <button
                        className={`theme-button ${theme === 'skiing' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('skiing')}
                    >
                        <span className="theme-icon">⛷️</span>
                        <span className="theme-name">Skiing</span>
                    </button>

                    <button
                        className={`theme-button ${theme === 'general' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('general')}
                    >
                        <span className="theme-icon">📚</span>
                        <span className="theme-name">General</span>
                    </button>
                </div>
            </div>

            <div className="settings-section card">
                <h2>🔊 Audio & Voice</h2>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Audio Playback</h3>
                        <p>Enable audio for vocabulary words</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={progress.settings.audioEnabled}
                            onChange={toggleAudio}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Microphone Recording</h3>
                        <p>Enable voice recording practice</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={progress.settings.microphoneEnabled}
                            onChange={toggleMicrophone}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div className="settings-section card">
                <h2>📊 Your Profile</h2>
                <div className="profile-info">
                    <p><strong>Name:</strong> {progress.profile.name}</p>
                    <p><strong>Native Language:</strong> {progress.profile.nativeLanguage}</p>
                    <p><strong>Daily Goal:</strong> {progress.profile.targetDailyMinutes} minutes</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
