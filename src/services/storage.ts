// localStorage wrapper for persisting user data

import type { ProgressData, Badge, DailyStats } from '../types/progress';

const STORAGE_KEYS = {
    PROGRESS: 'elis-english-progress',
    VERSION: 'elis-english-version'
} as const;

const CURRENT_VERSION = '1.0.0';

// Default data structure
const getDefaultProgressData = (): ProgressData => ({
    profile: {
        name: 'Eli',
        nativeLanguage: 'Croatian',
        targetDailyMinutes: 30
    },
    totalPoints: 0,
    totalMinutes: 0,
    streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: ''
    },
    dailyHistory: [],
    badges: getDefaultBadges(),
    wordPerformance: {},
    lessonsUnlocked: [],
    settings: {
        pin: '1234',
        enabledGames: [
            'flashcard',
            'multiple-choice',
            'drag-and-drop',
            'memory',
            'letter-scramble',
            'fill-in-the-gap',
            'dialogue',
            'voice-lesson'
        ],
        currentTheme: 'general',
        audioEnabled: true,
        microphoneEnabled: true
    }
});

// Default badge definitions
const getDefaultBadges = (): Badge[] => [
    {
        id: 'first-lesson',
        name: "Eli's First Steps",
        description: 'Complete your first lesson',
        theme: 'general',
        icon: '⭐',
        unlocked: false
    },
    {
        id: 'week-streak',
        name: "Eli's Winning Streak",
        description: 'Practice for 7 days in a row',
        theme: 'general',
        icon: '🔥',
        unlocked: false
    },
    {
        id: 'kpop-star',
        name: "Eli the K-pop Star",
        description: 'Complete 5 K-pop lessons',
        theme: 'kpop',
        icon: '🎤',
        unlocked: false
    },
    {
        id: 'hogwarts-owl',
        name: "Eli's Hogwarts Owl",
        description: 'Complete 5 Harry Potter lessons',
        theme: 'harry_potter',
        icon: '🦉',
        unlocked: false
    },
    {
        id: 'ski-star',
        name: "Eli the Ski Star",
        description: 'Complete 5 skiing lessons',
        theme: 'skiing',
        icon: '⛷️',
        unlocked: false
    },
    {
        id: 'word-master',
        name: "Eli's Vocabulary Champion",
        description: 'Learn 100 new words',
        theme: 'general',
        icon: '📚',
        unlocked: false
    },
    {
        id: 'perfect-score',
        name: "Eli's Perfect Performance",
        description: 'Get 100% on any lesson',
        theme: 'general',
        icon: '💯',
        unlocked: false
    }
];

export class StorageService {
    // Load progress data
    static loadProgress(): ProgressData {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
            const version = localStorage.getItem(STORAGE_KEYS.VERSION);

            if (!stored || version !== CURRENT_VERSION) {
                // Initialize or migrate data
                const defaultData = getDefaultProgressData();
                this.saveProgress(defaultData);
                localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
                return defaultData;
            }

            const data: ProgressData = JSON.parse(stored);

            // Merge with defaults to ensure all fields exist
            return {
                ...getDefaultProgressData(),
                ...data,
                settings: {
                    ...getDefaultProgressData().settings,
                    ...data.settings
                }
            };
        } catch (error) {
            console.error('Error loading progress:', error);
            return getDefaultProgressData();
        }
    }

    // Save progress data
    static saveProgress(data: ProgressData): void {
        try {
            localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    // Get today's stats or create new
    static getTodayStats(progress: ProgressData): DailyStats {
        const today = new Date().toISOString().split('T')[0];
        let todayStats = progress.dailyHistory.find(s => s.date === today);

        if (!todayStats) {
            todayStats = {
                date: today,
                minutesSpent: 0,
                lessonsCompleted: [],
                wordsReviewed: [],
                pointsEarned: 0,
                activitiesCompleted: []
            };
            progress.dailyHistory.unshift(todayStats);

            // Keep only last 30 days
            if (progress.dailyHistory.length > 30) {
                progress.dailyHistory = progress.dailyHistory.slice(0, 30);
            }
        }

        return todayStats;
    }

    // Update streak data
    static updateStreak(progress: ProgressData): void {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = progress.streak.lastActivityDate;

        if (!lastDate) {
            // First time
            progress.streak.currentStreak = 1;
            progress.streak.longestStreak = 1;
        } else if (lastDate === today) {
            // Already practiced today
            return;
        } else {
            const lastDateTime = new Date(lastDate).getTime();
            const todayTime = new Date(today).getTime();
            const daysDiff = Math.floor((todayTime - lastDateTime) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
                // Consecutive day
                progress.streak.currentStreak += 1;
                if (progress.streak.currentStreak > progress.streak.longestStreak) {
                    progress.streak.longestStreak = progress.streak.currentStreak;
                }
            } else {
                // Streak broken
                progress.streak.currentStreak = 1;
            }
        }

        progress.streak.lastActivityDate = today;
    }

    // Export progress as JSON
    static exportAsJSON(progress: ProgressData): string {
        return JSON.stringify(progress, null, 2);
    }

    // Export progress as Markdown report
    static exportAsMarkdown(progress: ProgressData): string {
        const report = `# Eli's English Learning Progress Report

**Generated**: ${new Date().toLocaleDateString()}

## Summary

- **Total Practice Time**: ${Math.floor(progress.totalMinutes)} minutes
- **Total Points**: ${progress.totalPoints}
- **Current Streak**: ${progress.streak.currentStreak} days 🔥
- **Longest Streak**: ${progress.streak.longestStreak} days
- **Badges Earned**: ${progress.badges.filter(b => b.unlocked).length} / ${progress.badges.length}

## Recent Activity (Last 7 Days)

${progress.dailyHistory.slice(0, 7).map(day => `
### ${day.date}
- Minutes: ${day.minutesSpent}
- Lessons: ${day.lessonsCompleted.length}
- Words Reviewed: ${day.wordsReviewed.length}
- Points: ${day.pointsEarned}
`).join('\n')}

## Earned Badges

${progress.badges.filter(b => b.unlocked).map(badge => `- ${badge.icon} **${badge.name}**: ${badge.description}`).join('\n')}

## Challenging Words

${Object.entries(progress.wordPerformance)
                .filter(([_, perf]) => perf.timesReviewed >= 3)
                .map(([id, perf]) => ({
                    id,
                    errorRate: perf.timesIncorrect / perf.timesReviewed
                }))
                .filter(w => w.errorRate > 0.3)
                .sort((a, b) => b.errorRate - a.errorRate)
                .slice(0, 10)
                .map(w => `- Word ID: ${w.id} (${Math.round(w.errorRate * 100)}% error rate)`)
                .join('\n') || 'No difficult words identified yet!'}
`;

        return report;
    }

    // Clear all data (for testing/reset)
    static clearAll(): void {
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.VERSION);
    }
}
