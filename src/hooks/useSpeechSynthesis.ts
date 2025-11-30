import { useState, useEffect, useRef } from 'react';

interface UseSpeechSynthesisResult {
    speak: (text: string, lang?: string) => void;
    speaking: boolean;
    supported: boolean;
    cancel: () => void;
}

export const useSpeechSynthesis = (): UseSpeechSynthesisResult => {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        // Check if Speech Synthesis API is available
        setSupported('speechSynthesis' in window);
    }, []);

    const speak = (text: string, lang: string = 'en-US') => {
        if (!supported || !window.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // Slightly slower for learners
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const cancel = () => {
        if (supported && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    };

    return { speak, speaking, supported, cancel };
};
