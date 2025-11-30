import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import './BadgeGallery.css';

const BadgeGallery: React.FC = () => {
    const { progress } = useProgress();

    const earnedBadges = progress.badges.filter(b => b.unlocked);
    const lockedBadges = progress.badges.filter(b => !b.unlocked);

    return (
        <div className="badge-gallery container">
            <h1>Eli's Badge Collection</h1>

            <div className="badge-stats">
                <div className="stat">
                    <span className="stat-number">{earnedBadges.length}</span>
                    <span className="stat-label">Earned</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{progress.badges.length}</span>
                    <span className="stat-label">Total</span>
                </div>
            </div>

            {earnedBadges.length > 0 && (
                <div className="badge-section">
                    <h2>✨ Earned Badges</h2>
                    <div className="badges-grid">
                        {earnedBadges.map(badge => (
                            <div key={badge.id} className="badge-card card earned">
                                <div className="badge-icon-large">{badge.icon}</div>
                                <h3>{badge.name}</h3>
                                <p className="badge-description">{badge.description}</p>
                                {badge.earnedAt && (
                                    <p className="badge-date">
                                        Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {lockedBadges.length > 0 && (
                <div className="badge-section">
                    <h2>🔒 Locked Badges</h2>
                    <p className="section-hint">Keep practicing to unlock these badges!</p>
                    <div className="badges-grid">
                        {lockedBadges.map(badge => (
                            <div key={badge.id} className="badge-card card locked">
                                <div className="badge-icon-large locked-icon">🔒</div>
                                <h3>{badge.name}</h3>
                                <p className="badge-description">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {earnedBadges.length === 0 && (
                <div className="motivational-card card">
                    <h3>Start Your Collection!</h3>
                    <p>Complete lessons to earn your first badge! 🌟</p>
                </div>
            )}
        </div>
    );
};

export default BadgeGallery;
