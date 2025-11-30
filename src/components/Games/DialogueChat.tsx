import React, { useState } from 'react';
import type { DialogueNode } from '../../types/lesson';
import { DialogueEngine } from '../../services/dialogueEngine';
import './DialogueChat.css';

interface DialogueChatProps {
    dialogueTree: DialogueNode[];
    startId: string;
    characterName: string;
    characterAvatar?: string;
    onComplete: (score: number) => void;
}

const DialogueChat: React.FC<DialogueChatProps> = ({
    dialogueTree,
    startId,
    characterName,
    characterAvatar,
    onComplete
}) => {
    const [engine] = useState(() => new DialogueEngine(dialogueTree, startId));
    const [currentState, setCurrentState] = useState(engine.getCurrentState());
    const [history, setHistory] = useState(engine.getHistory());

    const handleChoice = (choiceId: string) => {
        const success = engine.makeChoice(choiceId);
        if (success) {
            setCurrentState(engine.getCurrentState());
            setHistory(engine.getHistory());

            if (engine.isComplete()) {
                // Complete the dialogue - award full points
                setTimeout(() => {
                    onComplete(100);
                }, 1500);
            }
        }
    };

    return (
        <div className="dialogue-container">
            <div className="dialogue-header">
                {characterAvatar && (
                    <img src={characterAvatar} alt={characterName} className="character-avatar" />
                )}
                <h3>Chat with {characterName}</h3>
            </div>

            <div className="dialogue-messages">
                {history.map((node, index) => (
                    <div key={index} className="message-group">
                        <div className="message character-message">
                            <span className="message-speaker">{node.message.speaker}:</span>
                            <span className="message-text">{node.message.text}</span>
                        </div>
                        {index < history.length - 1 && history[index + 1] && (
                            <div className="message user-message">
                                <span className="message-text">
                                    {/* Find which choice was made to get to the next node */}
                                    {node.choices?.find(c => c.nextMessageId === history[index + 1].id)?.text}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {!currentState.isComplete && currentState.choices.length > 0 && (
                <div className="dialogue-choices">
                    <p className="choices-prompt">Choose your response:</p>
                    <div className="choices-grid">
                        {currentState.choices.map(choice => (
                            <button
                                key={choice.id}
                                className="choice-button"
                                onClick={() => handleChoice(choice.id)}
                            >
                                {choice.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentState.isComplete && (
                <div className="dialogue-complete">
                    <p>✨ Conversation complete! Great job, Eli!</p>
                </div>
            )}
        </div>
    );
};

export default DialogueChat;
