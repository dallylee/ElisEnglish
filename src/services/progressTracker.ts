// Service for tracking progress, awarding badges, and calculating statistics

import type { ProgressData, ActivityRecord, Badge, WordPerformance, DailyStats } from '../types/progress';
import { StorageService } from './storage';
import type { Lesson } from '../types/lesson';

export class ProgressTracker {
    // Record an activity completion
    static recordActivity(
        progress: ProgressData,
        lessonId: string,
        gameType: string,
        score: number,
        vocabularyUsed: string[],
        mistakes: string[] = []
    ): void {
        const todayStats = StorageService.getTodayStats(progress);

        // Create activity record
        const activity: ActivityRecord = {
            lessonId,
            gameType: gameType as any,
            score,
            completedAt: new Date().toISOString(),
            mistakes
        };

        todayStats.activitiesCompleted.push(activity);

        // Update points
        const pointsEarned = Math.round(score);
        todayStats.pointsEarned += pointsEarned;
        progress.totalPoints += pointsEarned;

        // Track words reviewed
        vocabularyUsed.forEach(vocabId => {
            if (!todayStats.wordsReviewed.includes(vocabId)) {
                todayStats.wordsReviewed.push(vocabId);
            }

            // Update word performance
            if (!progress.wordPerformance[vocabId]) {
                progress.wordPerformance[vocabId] = {
                    vocabularyId: vocabId,
                    timesReviewed: 0,
                    timesCorrect: 0,
                    timesIncorrect: 0,
                    lastReviewedAt: new Date().toISOString()
                };
            }

            const perf = progress.wordPerformance[vocabId];
            perf.timesReviewed += 1;
            perf.lastReviewedAt = new Date().toISOString();

            if (mistakes.includes(vocabId)) {
                perf.timesIncorrect += 1;
            } else {
                perf.timesCorrect += 1;
            }
        });

        // Update streak
        StorageService.updateStreak(progress);

        // Check for badge unlocks
        this.checkBadges(progress);

        // Save progress
        StorageService.saveProgress(progress);
    }

    // Record lesson completion
    static recordLessonComplete(
        progress: ProgressData,
        lessonId: string,
        minutesSpent: number
    ): void {
        const todayStats = StorageService.getTodayStats(progress);

        if (!todayStats.lessonsCompleted.includes(lessonId)) {
            todayStats.lessonsCompleted.push(lessonId);
        }

        todayStats.minutesSpent += minutesSpent;
        progress.totalMinutes += minutesSpent;

        // Check badges
        this.checkBadges(progress);

        StorageService.saveProgress(progress);
    }

    // Check and unlock badges
    private static checkBadges(progress: ProgressData): void {
        const badges = progress.badges;

        // First lesson badge
        if (!badges.find(b => b.id === 'first-lesson')?.unlocked) {
            const todayStats = StorageService.getTodayStats(progress);
            if (todayStats.lessonsCompleted.length > 0) {
                this.unlockBadge(progress, 'first-lesson');
            }
        }

        // Week streak badge
        if (!badges.find(b => b.id === 'week-streak')?.unlocked) {
            if (progress.streak.currentStreak >= 7) {
                this.unlockBadge(progress, 'week-streak');
            }
        }

        // Word master badge (100 unique words)
        if (!badges.find(b => b.id === 'word-master')?.unlocked) {
            const uniqueWordsCount = Object.keys(progress.wordPerformance).length;
            if (uniqueWordsCount >= 100) {
                this.unlockBadge(progress, 'word-master');
            }
        }

        // Perfect score badge
        if (!badges.find(b => b.id === 'perfect-score')?.unlocked) {
            const todayStats = StorageService.getTodayStats(progress);
            const hasPerfectScore = todayStats.activitiesCompleted.some(a => a.score >= 100);
            if (hasPerfectScore) {
                this.unlockBadge(progress, 'perfect-score');
            }
        }

        // Theme-specific badges (5 lessons each)
        const checkThemeBadge = (theme: string, badgeId: string) => {
            if (!badges.find(b => b.id === badgeId)?.unlocked) {
                const allCompletedLessons = progress.dailyHistory
                    .flatMap(day => day.lessonsCompleted);
                // This would need lesson data to check themes - placeholder for now
                // In a real scenario, we'd track theme completion separately
            }
        };

        checkThemeBadge('kpop', 'kpop-star');
        checkThemeBadge('harry_potter', 'hogwarts-owl');
        checkThemeBadge('skiing', 'ski-star');
    }

    // Unlock a specific badge
    static unlockBadge(progress: ProgressData, badgeId: string): Badge | null {
        const badge = progress.badges.find(b => b.id === badgeId);
        if (badge && !badge.unlocked) {
            badge.unlocked = true;
            badge.earnedAt = new Date().toISOString();
            return badge;
        }
        return null;
    }

    // Get difficult words (error rate > 30%, at least 3 reviews)
    static getDifficultWords(progress: ProgressData): Array<{
        vocabularyId: string;
        errorRate: number;
        timesReviewed: number;
    }> {
        return Object.values(progress.wordPerformance)
            .filter(perf => perf.timesReviewed >= 3)
            .map(perf => ({
                vocabularyId: perf.vocabularyId,
                errorRate: perf.timesIncorrect / perf.timesReviewed,
                timesReviewed: perf.timesReviewed
            }))
            .filter(w => w.errorRate > 0.3)
            .sort((a, b) => b.errorRate - a.errorRate);
    }

    // Get theme usage statistics
    static getThemeUsage(progress: ProgressData, lessons: Lesson[]): Record<string, number> {
        const themeMinutes: Record<string, number> = {
            kpop: 0,
            harry_potter: 0,
            skiing: 0,
            general: 0
        };

        progress.dailyHistory.forEach(day => {
            day.lessonsCompleted.forEach(lessonId => {
                const lesson = lessons.find(l => l.id === lessonId);
                if (lesson) {
                    themeMinutes[lesson.theme] = (themeMinutes[lesson.theme] || 0) + lesson.estimatedMinutes;
                }
            });
        });

        return themeMinutes;
    }

    // Calculate average daily minutes (last 7 days)
    static getAverageDailyMinutes(progress: ProgressData): number {
        const last7Days = progress.dailyHistory.slice(0, 7);
        if (last7Days.length === 0) return 0;

        const totalMinutes = last7Days.reduce((sum, day) => sum + day.minutesSpent, 0);
        return Math.round(totalMinutes / last7Days.length);
    }
}
