import React, { useState, useEffect } from 'react';
import type { MemoryGameConfig, VocabularyItem } from '../../types/lesson';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import confetti from 'canvas-confetti';
import './MemoryGame.css';

interface MemoryGameProps {
    data: MemoryGameConfig;
    vocabulary: VocabularyItem[];
    onComplete: (score: number) => void;
}

interface Card {
    id: string;
    vocabId: string;
    type: 'word' | 'image' | 'translation';
    content: string;
    image?: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ data, vocabulary, onComplete }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchesFound, setMatchesFound] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const { speak } = useSpeechSynthesis();

    // Initialize game
    useEffect(() => {
        initializeGame();
    }, [data, vocabulary]);

    const initializeGame = () => {
        // Select vocabulary for this game
        const gameVocab = vocabulary.filter(v => data.vocabulary?.includes(v.id));

        // Determine grid size (default to 2x vocab size or specified size)
        // If specific size not set, use all vocab items * 2
        const itemsToUse = data.gridSize
            ? gameVocab.slice(0, data.gridSize / 2)
            : gameVocab;

        // Create pairs
        const newCards: Card[] = [];
        itemsToUse.forEach(item => {
            // Card 1: English Word
            newCards.push({
                id: `${item.id}-word`,
                vocabId: item.id,
                type: 'word',
                content: item.english,
                isFlipped: false,
                isMatched: false
            });

            // Card 2: Image (if available) or Translation
            if (item.image) {
                newCards.push({
                    id: `${item.id}-image`,
                    vocabId: item.id,
                    type: 'image',
                    content: item.english, // For accessibility/fallback
                    image: item.image,
                    isFlipped: false,
                    isMatched: false
                });
            } else {
                newCards.push({
                    id: `${item.id}-translation`,
                    vocabId: item.id,
                    type: 'translation',
                    content: item.croatian || 'Translation',
                    isFlipped: false,
                    isMatched: false
                });
            }
        });

        // Shuffle cards
        const shuffledCards = newCards.sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
        setFlippedIndices([]);
        setMatchesFound(0);
        setIsLocked(false);
    };

    const handleCardClick = (index: number) => {
        // Prevent clicking if locked, already flipped, or matched
        if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

        // Flip the card
        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        // Speak the content if it's a word or translation
        if (newCards[index].type === 'word' || newCards[index].type === 'translation') {
            if (newCards[index].type === 'word') {
                speak(newCards[index].content);
            }
        }

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        // Check for match if 2 cards flipped
        if (newFlippedIndices.length === 2) {
            setIsLocked(true);
            checkForMatch(newFlippedIndices, newCards);
        }
    };

    const checkForMatch = (indices: number[], currentCards: Card[]) => {
        const [index1, index2] = indices;
        const card1 = currentCards[index1];
        const card2 = currentCards[index2];

        if (card1.vocabId === card2.vocabId) {
            // Match found!
            setTimeout(() => {
                const newCards = [...currentCards];
                newCards[index1].isMatched = true;
                newCards[index2].isMatched = true;
                setCards(newCards);
                setFlippedIndices([]);
                setIsLocked(false);
                setMatchesFound(prev => prev + 1);

                // Check for game completion
                if (matchesFound + 1 === currentCards.length / 2) {
                    handleGameComplete();
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                const newCards = [...currentCards];
                newCards[index1].isFlipped = false;
                newCards[index2].isFlipped = false;
                setCards(newCards);
                setFlippedIndices([]);
                setIsLocked(false);
            }, 1000);
        }
    };

    const handleGameComplete = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => {
            onComplete(100);
        }, 1500);
    };

    return (
        <div className="memory-game-container">
            <div className="memory-stats">
                <span>Matches: {matchesFound} / {cards.length / 2}</span>
            </div>

            <div className={`memory-grid grid-${cards.length}`}>
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        <div className="card-face card-front">
                            {/* Back of card design (visible when not flipped) */}
                        </div>
                        <div className="card-face card-back">
                            {card.image ? (
                                <img src={card.image} alt={card.content} className="card-image" />
                            ) : null}
                            <div className={`card-text ${!card.image ? 'large' : ''}`}>
                                {card.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemoryGame;
