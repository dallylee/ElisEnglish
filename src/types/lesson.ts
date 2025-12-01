// Lesson data types

export type Theme = 'kpop' | 'harry_potter' | 'skiing' | 'general';
export type DifficultyLevel = 'A0' | 'A1' | 'A2';
export type GameType =
    | 'flashcard'
    | 'multiple-choice'
    | 'drag-and-drop'
    | 'memory'
    | 'letter-scramble'
    | 'fill-in-the-gap'
    | 'dialogue'
    | 'voice-lesson';

export interface VocabularyItem {
    id: string;
    english: string;
    croatian: string;
    image?: string; // Path to image in assets/images
    audio?: string; // Path to audio in assets/audio
}

export interface DialogueMessage {
    id: string;
    speaker: string; // Character name
    text: string;
    audio?: string;
}

export interface DialogueChoice {
    id: string;
    text: string;
    nextMessageId: string; // ID of the next message in the tree
}

export interface DialogueNode {
    id: string;
    message: DialogueMessage;
    choices?: DialogueChoice[]; // If undefined, conversation ends
}

export interface DialogueCharacter {
    name: string;
    avatar?: string; // Path to character image
    theme: Theme;
}

export interface BaseGameConfig {
    type: GameType;
    id?: string;
    vocabulary?: string[]; // IDs of vocabulary items to use
}

export interface FlashcardGameConfig extends BaseGameConfig {
    type: 'flashcard';
}

export interface MultipleChoiceGameConfig extends BaseGameConfig {
    type: 'multiple-choice';
    settings?: {
        mode: 'word-to-translation' | 'word-to-picture';
        questionCount?: number;
    };
}

export interface DialogueGameConfig extends BaseGameConfig {
    type: 'dialogue';
    dialogueStartId: string;
}

export interface MemoryGameConfig extends BaseGameConfig {
    type: 'memory';
    gridSize?: 4 | 6 | 8 | 12;
}

export type GameConfig = FlashcardGameConfig | MultipleChoiceGameConfig | DialogueGameConfig | MemoryGameConfig;

export interface Lesson {
    id: string;
    title: string;
    theme: Theme;
    difficultyLevel: DifficultyLevel;
    estimatedMinutes: number;
    vocabulary: VocabularyItem[];
    dialogueCharacter?: DialogueCharacter;
    dialogueTree?: DialogueNode[];
    games: GameConfig[];
    unlocked?: boolean; // Default true, can be locked in tutor settings
}

// Voice lesson types

export interface ComprehensionQuestion {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    question: string;
    options?: string[]; // For multiple choice
    correctAnswer: string | number; // Answer text or index
}

export interface VoiceLessonStep {
    id: string;
    transcript: string;
    audioFile: string; // Filename in assets/audio
    image?: string;
    questions: ComprehensionQuestion[];
}

export interface VoiceLesson {
    id: string;
    title: string;
    theme: Theme;
    level: DifficultyLevel;
    estimatedMinutes: number;
    steps: VoiceLessonStep[];
}
