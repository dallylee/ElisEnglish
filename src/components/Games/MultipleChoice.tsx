import React, { useState } from 'react';
import type { VocabularyItem } from '../../types/lesson';
import './MultipleChoice.css';

interface MultipleChoiceProps {
    vocabulary: VocabularyItem[];
    mode: 'word-to-picture' | 'word-to-translation';
    onComplete: (score: number, mistakes: string[]) => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ vocabulary, mode, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const currentWord = vocabulary[currentIndex];
    const progress = ((currentIndex + 1) / vocabulary.length) * 100;

    // Generate options (1 correct + 3 random from vocabulary)
    const getOptions = (): VocabularyItem[] => {
        const options = [currentWord];
        const others = vocabulary.filter(v => v.id !== currentWord.id);

        // Add 3 random others
        for (let i = 0; i < 3 && others.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * others.length);
            options.push(others[randomIndex]);
            others.splice(randomIndex, 1);
        }

        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    };

    const [options] = useState(getOptions());

    const handleSelectAnswer = (index: number) => {
        if (showFeedback) return;

        setSelectedAnswer(index);
        setShowFeedback(true);

        const isCorrect = options[index].id === currentWord.id;

        if (isCorrect) {
            setScore(score + 1);
        } else {
            setMistakes([...mistakes, currentWord.id]);
        }

        // Auto advance after 1.5 seconds
        setTimeout(() => {
            handleNext();
        }, 1500);
    };

    const handleNext = () => {
        if (currentIndex < vocabulary.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            // Complete
            const finalScore = Math.round((score / vocabulary.length) * 100);
            onComplete(finalScore, mistakes);
        }
    };

    if (!currentWord) {
        return <div>No vocabulary items available</div>;
    }

    return (
        <div className="multiple-choice-container">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="question-counter">
                Question {currentIndex + 1} of {vocabulary.length}
            </div>

            <div className="question-card card">
                {mode === 'word-to-picture' && currentWord.image && (
                    <div>
                        <h3>What is this?</h3>
                        <img src={currentWord.image} alt="question" className="question-image" />
                    </div>
                )}

                {mode === 'word-to-translation' && (
                    <div>
                        <h3>Translate to English:</h3>
                        <div className="question-text">{currentWord.croatian}</div>
                    </div>
                )}
            </div>

            <div className="options-grid">
                {options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = option.id === currentWord.id;
                    let className = 'option-button card';

                    if (showFeedback && isSelected) {
                        className += isCorrect ? ' correct' : ' incorrect';
                    }
                    if (showFeedback && isCorrect) {
                        className += ' correct';
                    }

                    return (
                        <button
                            key={index}
                            className={className}
                            onClick={() => handleSelectAnswer(index)}
                            disabled={showFeedback}
                        >
                            {mode === 'word-to-picture' && option.english}
                            {mode === 'word-to-translation' && option.english}
                        </button>
                    );
                })}
            </div>

            {showFeedback && (
                <div className={`feedback ${selectedAnswer !== null && options[selectedAnswer].id === currentWord.id ? 'success' : 'error'}`}>
                    {selectedAnswer !== null && options[selectedAnswer].id === currentWord.id ? '✓ Correct!' : '✗ Try again next time!'}
                </div>
            )}
        </div>
    );
};

export default MultipleChoice;
