// Progress tracking types

import { Theme, GameType } from './lesson';

export interface UserProfile {
    name: string; // "Eli"
    nativeLanguage: string; // "Croatian"
    targetDailyMinutes: number; // Default 30
}

export interface DailyStats {
    date: string; // ISO date string
    minutesSpent: number;
    lessonsCompleted: string[]; // Lesson IDs
    wordsReviewed: string[]; // Vocabulary IDs
    pointsEarned: number;
    activitiesCompleted: ActivityRecord[];
}

export interface ActivityRecord {
    lessonId: string;
    gameType: GameType;
    score: number; // Percentage or points
    completedAt: string; // ISO timestamp
    mistakes?: string[]; // Vocabulary IDs that were incorrect
}

export interface Badge {
    id: string;
    name: string; // e.g., "Eli the Ski Star"
    description: string;
    theme: Theme;
    icon: string; // Emoji or image path
    earnedAt?: string; // ISO timestamp when earned
    unlocked: boolean;
}

export interface StreakData {
    currentStreak: number; // Days
    longestStreak: number;
    lastActivityDate: string; // ISO date
}

export interface WordPerformance {
    vocabularyId: string;
    timesReviewed: number;
    timesCorrect: number;
    timesIncorrect: number;
    lastReviewedAt: string;
}

export interface ProgressData {
    profile: UserProfile;
    totalPoints: number;
    totalMinutes: number;
    streak: StreakData;
    dailyHistory: DailyStats[]; // Last 30 days
    badges: Badge[];
    wordPerformance: Record<string, WordPerformance>; // Keyed by vocabulary ID
    lessonsUnlocked: string[]; // Lesson IDs
    settings: UserSettings;
}

export interface UserSettings {
    pin: string; // Tutor PIN, default "1234"
    enabledGames: GameType[]; // Which games are active
    currentTheme: Theme;
    audioEnabled: boolean;
    microphoneEnabled: boolean;
}

// Export report types

export interface ProgressReport {
    generatedAt: string;
    profile: UserProfile;
    summary: {
        totalDays: number;
        totalMinutes: number;
        totalPoints: number;
        currentStreak: number;
        badgesEarned: number;
    };
    recentActivity: DailyStats[];
    difficultWords: Array<{
        word: string;
        errorRate: number;
    }>;
    themeUsage: Record<Theme, number>; // Minutes per theme
}
