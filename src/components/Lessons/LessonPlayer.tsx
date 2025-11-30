import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Lesson, GameConfig } from '../../types/lesson';
import { LessonLoader } from '../../services/lessonLoader';
import { useProgress } from '../../contexts/ProgressContext';
import { ProgressTracker } from '../../services/progressTracker';
import Flashcard from '../Games/Flashcard';
import MultipleChoice from '../Games/MultipleChoice';
import DialogueChat from '../Games/DialogueChat';
import './LessonPlayer.css';

const LessonPlayer: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const { updateProgress } = useProgress();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const loadLesson = async () => {
            if (lessonId) {
                const loadedLesson = await LessonLoader.getLessonById(lessonId);
                setLesson(loadedLesson);
                setLoading(false);
            }
        };

        loadLesson();
    }, [lessonId]);

    const handleActivityComplete = (score: number, mistakes: string[] = []) => {
        if (!lesson) return;

        const currentGame = lesson.games[currentActivityIndex];
        const vocabularyIds = currentGame.vocabulary || [];

        // Record the activity
        updateProgress(prev => {
            ProgressTracker.recordActivity(
                prev,
                lesson.id,
                currentGame.type,
                score,
                vocabularyIds,
                mistakes
            );
            return prev;
        });

        // Move to next activity or complete lesson
        if (currentActivityIndex < lesson.games.length - 1) {
            setCurrentActivityIndex(currentActivityIndex + 1);
        } else {
            completeLesson();
        }
    };

    const completeLesson = () => {
        if (!lesson) return;

        const minutesSpent = Math.round((Date.now() - startTime) / 60000);

        updateProgress(prev => {
            ProgressTracker.recordLessonComplete(prev, lesson.id, minutesSpent);
            return prev;
        });

        navigate('/lesson-complete', { state: { lesson, minutesSpent } });
    };

    const renderActivity = (game: GameConfig) => {
        if (!lesson) return null;

        const getVocabulary = () => {
            if (!game.vocabulary) return [];
            return lesson.vocabulary.filter(v => game.vocabulary?.includes(v.id));
        };

        switch (game.type) {
            case 'flashcard':
                return (
                    <Flashcard
                        vocabulary={getVocabulary()}
                        onComplete={handleActivityComplete}
                    />
                );

            case 'multiple-choice':
                return (
                    <MultipleChoice
                        vocabulary={getVocabulary()}
                        mode={game.settings?.mode || 'word-to-translation'}
                        onComplete={handleActivityComplete}
                    />
                );

            case 'dialogue':
                if (!lesson.dialogueTree || !game.dialogueStartId) return null;
                return (
                    <DialogueChat
                        dialogueTree={lesson.dialogueTree}
                        startId={game.dialogueStartId}
                        characterName={lesson.dialogueCharacter?.name || 'Teacher'}
                        characterAvatar={lesson.dialogueCharacter?.avatar}
                        onComplete={handleActivityComplete}
                    />
                );

            default:
                return <div>Game type not yet implemented: {game.type}</div>;
        }
    };

    if (loading) {
        return (
            <div className="container text-center" style={{ padding: '4rem' }}>
                <div className="spinner"></div>
                <p>Loading lesson...</p>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="container text-center" style={{ padding: '4rem' }}>
                <h2>Lesson not found</h2>
                <button onClick={() => navigate('/lessons')}>Back to Lessons</button>
            </div>
        );
    }

    const currentGame = lesson.games[currentActivityIndex];
    const progressPercent = ((currentActivityIndex + 1) / lesson.games.length) * 100;

    return (
        <div className="lesson-player">
            <div className="lesson-header">
                <div className="container">
                    <h2>{lesson.title}</h2>
                    <div className="lesson-progress-bar">
                        <div
                            className="lesson-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <p className="activity-counter">
                        Activity {currentActivityIndex + 1} of {lesson.games.length}
                    </p>
                </div>
            </div>

            <div className="lesson-content">
                {renderActivity(currentGame)}
            </div>
        </div>
    );
};

export default LessonPlayer;
