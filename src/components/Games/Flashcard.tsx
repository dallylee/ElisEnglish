import React, { useState } from 'react';
import type { VocabularyItem } from '../../types/lesson';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import './Flashcard.css';

interface FlashcardProps {
    vocabulary: VocabularyItem[];
    onComplete: (score: number, mistakes: string[]) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ vocabulary, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [reviewedCount, setReviewedCount] = useState(0);
    const { speak, supported } = useSpeechSynthesis();

    const currentCard = vocabulary[currentIndex];
    const progress = ((currentIndex + 1) / vocabulary.length) * 100;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentIndex < vocabulary.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
            setReviewedCount(reviewedCount + 1);
        } else {
            // Complete - give full points for reviewing all cards
            onComplete(100, []);
        }
    };

    const handleSpeak = () => {
        if (supported && currentCard) {
            speak(currentCard.english);
        }
    };

    const playAudio = () => {
        if (currentCard.audio) {
            const audio = new Audio(currentCard.audio);
            audio.play();
        }
    };

    if (!currentCard) {
        return <div>No vocabulary items available</div>;
    }

    return (
        <div className="flashcard-container">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flashcard-counter">
                Card {currentIndex + 1} of {vocabulary.length}
            </div>

            <div
                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={handleFlip}
            >
                <div className="flashcard-front">
                    {currentCard.image && (
                        <img src={currentCard.image} alt={currentCard.english} className="flashcard-image" />
                    )}
                    <div className="flashcard-word">{currentCard.english}</div>
                    <p className="flashcard-hint">Tap to see translation</p>
                </div>

                <div className="flashcard-back">
                    <div className="flashcard-translation">{currentCard.croatian}</div>
                    <div className="flashcard-word-small">{currentCard.english}</div>
                </div>
            </div>

            <div className="flashcard-controls">
                <button
                    onClick={(e) => { e.stopPropagation(); handleSpeak(); }}
                    disabled={!supported}
                    className="icon-button"
                    title="Text-to-speech"
                >
                    🔊 Speak
                </button>

                {currentCard.audio && (
                    <button
                        onClick={(e) => { e.stopPropagation(); playAudio(); }}
                        className="icon-button"
                    >
                        🎵 Play Audio
                    </button>
                )}

                <button onClick={handleNext} className="next-button">
                    {currentIndex < vocabulary.length - 1 ? 'Next Card →' : 'Finish ✓'}
                </button>
            </div>
        </div>
    );
};

export default Flashcard;
