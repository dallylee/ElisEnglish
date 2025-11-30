// Service for dynamically loading lesson files from the lessons/ and voice-lessons/ directories

import type { Lesson, VoiceLesson } from '../types/lesson';

export class LessonLoader {
    private static lessonCache: Lesson[] | null = null;
    private static voiceLessonCache: VoiceLesson[] | null = null;

    // Load all regular lessons using Vite's glob import
    static async loadLessons(): Promise<Lesson[]> {
        if (this.lessonCache) {
            return this.lessonCache;
        }

        try {
            // Vite's import.meta.glob dynamically imports all JSON files in /lessons
            const lessonModules = import.meta.glob('/lessons/*.json');

            const lessons: Lesson[] = [];

            for (const path in lessonModules) {
                const module = await lessonModules[path]() as { default: Lesson };
                lessons.push({
                    ...module.default,
                    unlocked: module.default.unlocked !== undefined ? module.default.unlocked : true
                });
            }

            // Sort by difficulty and theme
            lessons.sort((a, b) => {
                const difficultyOrder = { 'A0': 0, 'A1': 1, 'A2': 2 };
                return difficultyOrder[a.difficultyLevel] - difficultyOrder[b.difficultyLevel];
            });

            this.lessonCache = lessons;
            return lessons;
        } catch (error) {
            console.error('Error loading lessons:', error);
            return [];
        }
    }

    // Load all voice lessons
    static async loadVoiceLessons(): Promise<VoiceLesson[]> {
        if (this.voiceLessonCache) {
            return this.voiceLessonCache;
        }

        try {
            const voiceLessonModules = import.meta.glob('/voice-lessons/*.json');

            const voiceLessons: VoiceLesson[] = [];

            for (const path in voiceLessonModules) {
                const module = await voiceLessonModules[path]() as { default: VoiceLesson };
                voiceLessons.push(module.default);
            }

            // Sort by level
            voiceLessons.sort((a, b) => {
                const difficultyOrder = { 'A0': 0, 'A1': 1, 'A2': 2 };
                return difficultyOrder[a.level] - difficultyOrder[b.level];
            });

            this.voiceLessonCache = voiceLessons;
            return voiceLessons;
        } catch (error) {
            console.error('Error loading voice lessons:', error);
            return [];
        }
    }

    // Get a specific lesson by ID
    static async getLessonById(id: string): Promise<Lesson | null> {
        const lessons = await this.loadLessons();
        return lessons.find(lesson => lesson.id === id) || null;
    }

    // Get a specific voice lesson by ID
    static async getVoiceLessonById(id: string): Promise<VoiceLesson | null> {
        const voiceLessons = await this.loadVoiceLessons();
        return voiceLessons.find(lesson => lesson.id === id) || null;
    }

    // Get lessons by theme
    static async getLessonsByTheme(theme: string): Promise<Lesson[]> {
        const lessons = await this.loadLessons();
        return lessons.filter(lesson => lesson.theme === theme);
    }

    // Clear cache to force reload
    static clearCache(): void {
        this.lessonCache = null;
        this.voiceLessonCache = null;
    }
}
