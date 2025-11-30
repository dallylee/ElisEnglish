import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import './HomeScreen.css';

const HomeScreen: React.FC = () => {
    const { progress } = useProgress();

    const todayStats = progress.dailyHistory.find(
        day => day.date === new Date().toISOString().split('T')[0]
    );

    const earnedBadges = progress.badges.filter(b => b.unlocked);

    return (
        <div className="home-screen container">
            <div className="welcome-section fade-in">
                <h1>Hi Eli! 👋</h1>
                <p className="welcome-subtitle">Ready for today's English adventure?</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                        <div className="stat-value">{progress.streak.currentStreak}</div>
                        <div className="stat-label">Day Streak</div>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <div className="stat-value">{progress.totalPoints}</div>
                        <div className="stat-label">Total Points</div>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <div className="stat-value">{earnedBadges.length}</div>
                        <div className="stat-label">Badges</div>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <div className="stat-value">{todayStats?.minutesSpent || 0}</div>
                        <div className="stat-label">Minutes Today</div>
                    </div>
                </div>
            </div>

            <div className="action-section">
                <Link to="/daily-mission" className="primary-button">
                    🚀 Start Daily Mission
                </Link>

                <div className="secondary-actions gap-md">
                    <Link to="/lessons" className="secondary-button">
                        📚 Browse Lessons
                    </Link>
                    <Link to="/badges" className="secondary-button">
                        🏅 View Badges
                    </Link>
                </div>
            </div>

            {earnedBadges.length === 0 && (
                <div className="motivational-message card">
                    <p>🎯 Complete your first lesson to earn your first badge!</p>
                </div>
            )}

            {earnedBadges.length > 0 && (
                <div className="recent-badges">
                    <h3>Recent Badges</h3>
                    <div className="badge-list">
                        {earnedBadges.slice(0, 3).map(badge => (
                            <div key={badge.id} className="badge-item card">
                                <span className="badge-icon">{badge.icon}</span>
                                <span className="badge-name">{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
