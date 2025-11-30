import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lesson } from '../../types/lesson';
import { LessonLoader } from '../../services/lessonLoader';
import './LessonBrowser.css';

const LessonBrowser: React.FC = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        const loadLessons = async () => {
            const loadedLessons = await LessonLoader.loadLessons();
            setLessons(loadedLessons);
            setLoading(false);
        };

        loadLessons();
    }, []);

    const filteredLessons = lessons.filter(lesson =>
        filter === 'all' ? true : lesson.theme === filter
    );

    const getThemeIcon = (theme: string) => {
        switch (theme) {
            case 'kpop': return '🎤';
            case 'harry_potter': return '🦉';
            case 'skiing': return '⛷️';
            default: return '📚';
        }
    };

    if (loading) {
        return (
            <div className="container text-center" style={{ padding: '4rem' }}>
                <div className="spinner"></div>
                <p>Loading lessons...</p>
            </div>
        );
    }

    return (
        <div className="lesson-browser container">
            <h1>Browse Lessons</h1>

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Lessons
                </button>
                <button
                    className={`filter-tab ${filter === 'kpop' ? 'active' : ''}`}
                    onClick={() => setFilter('kpop')}
                >
                    🎤 K-pop
                </button>
                <button
                    className={`filter-tab ${filter === 'harry_potter' ? 'active' : ''}`}
                    onClick={() => setFilter('harry_potter')}
                >
                    🦉 Harry Potter
                </button>
                <button
                    className={`filter-tab ${filter === 'skiing' ? 'active' : ''}`}
                    onClick={() => setFilter('skiing')}
                >
                    ⛷️ Skiing
                </button>
            </div>

            <div className="lessons-grid">
                {filteredLessons.map(lesson => (
                    <Link
                        to={`/lesson/${lesson.id}`}
                        key={lesson.id}
                        className="lesson-card card"
                    >
                        <div className="lesson-icon">{getThemeIcon(lesson.theme)}</div>
                        <h3>{lesson.title}</h3>
                        <div className="lesson-meta">
                            <span className="lesson-level">{lesson.difficultyLevel}</span>
                            <span className="lesson-time">⏱️ {lesson.estimatedMinutes} min</span>
                        </div>
                        <div className="lesson-vocab-count">
                            {lesson.vocabulary.length} words
                        </div>
                    </Link>
                ))}
            </div>

            {filteredLessons.length === 0 && (
                <div className="no-lessons card">
                    <p>No lessons found for this theme yet!</p>
                </div>
            )}
        </div>
    );
};

export default LessonBrowser;
