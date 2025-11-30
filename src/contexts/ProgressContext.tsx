import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { ProgressData } from '../types/progress';
import { StorageService } from '../services/storage';

interface ProgressContextType {
    progress: ProgressData;
    updateProgress: (updater: (prev: ProgressData) => ProgressData) => void;
    refreshProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [progress, setProgress] = useState<ProgressData>(() => StorageService.loadProgress());

    const updateProgress = (updater: (prev: ProgressData) => ProgressData) => {
        setProgress(prev => {
            const updated = updater(prev);
            StorageService.saveProgress(updated);
            return updated;
        });
    };

    const refreshProgress = () => {
        setProgress(StorageService.loadProgress());
    };

    return (
        <ProgressContext.Provider value={{ progress, updateProgress, refreshProgress }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = (): ProgressContextType => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};
