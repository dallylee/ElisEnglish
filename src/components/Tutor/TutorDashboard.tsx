import React, { useState } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { StorageService } from '../../services/storage';
import { ProgressTracker } from '../../services/progressTracker';
import './TutorDashboard.css';

const TutorDashboard: React.FC = () => {
    const { progress } = useProgress();
    const [pin, setPin] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showExport, setShowExport] = useState(false);

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === progress.settings.pin) {
            setIsUnlocked(true);
        } else {
            alert('Incorrect PIN');
            setPin('');
        }
    };

    const handleExportJSON = () => {
        const json = StorageService.exportAsJSON(progress);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eli-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleExportMarkdown = () => {
        const markdown = StorageService.exportAsMarkdown(progress);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eli-progress-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
    };

    if (!isUnlocked) {
        return (
            <div className="tutor-lock container">
                <div className="pin-card card">
                    <h2>🔒 Tutor Dashboard</h2>
                    <p>Enter PIN to access</p>
                    <form onSubmit={handlePinSubmit}>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Enter PIN"
                            className="pin-input"
                            maxLength={4}
                        />
                        <button type="submit" className="unlock-button">
                            Unlock
                        </button>
                    </form>
                    <p className="pin-hint">Default PIN: 1234</p>
                </div>
            </div>
        );
    }

    const avgDailyMinutes = ProgressTracker.getAverageDailyMinutes(progress);
    const difficultWords = ProgressTracker.getDifficultWords(progress);
    const last7Days = progress.dailyHistory.slice(0, 7);

    return (
        <div className="tutor-dashboard container">
            <div className="dashboard-header">
                <h1>📊 Tutor Dashboard</h1>
                <button onClick={() => setIsUnlocked(false)} className="lock-button">
                    🔒 Lock
                </button>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card card">
                    <h2>📈 Usage Statistics</h2>
                    <div className="stats">
                        <div className="stat-row">
                            <span>Total Practice Time:</span>
                            <strong>{Math.floor(progress.totalMinutes)} minutes</strong>
                        </div>
                        <div className="stat-row">
                            <span>Current Streak:</span>
                            <strong>{progress.streak.currentStreak} days</strong>
                        </div>
                        <div className="stat-row">
                            <span>Longest Streak:</span>
                            <strong>{progress.streak.longestStreak} days</strong>
                        </div>
                        <div className="stat-row">
                            <span>Avg. Daily (7 days):</span>
                            <strong>{avgDailyMinutes} minutes</strong>
                        </div>
                        <div className="stat-row">
                            <span>Total Points:</span>
                            <strong>{progress.totalPoints}</strong>
                        </div>
                        <div className="stat-row">
                            <span>Badges Earned:</span>
                            <strong>{progress.badges.filter(b => b.unlocked).length} / {progress.badges.length}</strong>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card card">
                    <h2>📅 Recent Activity</h2>
                    <div className="activity-list">
                        {last7Days.map(day => (
                            <div key={day.date} className="activity-item">
                                <div className="activity-date">{day.date}</div>
                                <div className="activity-stats">
                                    <span>⏱️ {day.minutesSpent} min</span>
                                    <span>📚 {day.lessonsCompleted.length} lessons</span>
                                    <span>⭐ {day.pointsEarned} pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {difficultWords.length > 0 && (
                    <div className="dashboard-card card">
                        <h2>⚠️ Challenging Words</h2>
                        <p className="card-description">Words with high error rates (need more practice)</p>
                        <div className="difficult-words-list">
                            {difficultWords.slice(0, 10).map(word => (
                                <div key={word.vocabularyId} className="difficult-word-item">
                                    <span className="word-id">{word.vocabularyId}</span>
                                    <span className="error-rate">{Math.round(word.errorRate * 100)}% errors</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="dashboard-card card">
                    <h2>💾 Export Progress</h2>
                    <p className="card-description">Download Eli's progress data</p>
                    <div className="export-buttons">
                        <button onClick={handleExportJSON} className="export-button">
                            📄 Export as JSON
                        </button>
                        <button onClick={handleExportMarkdown} className="export-button">
                            📝 Export as Markdown
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;
