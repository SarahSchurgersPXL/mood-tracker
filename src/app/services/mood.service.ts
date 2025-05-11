import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MoodService {
  private storageKey = 'moods';

  logMood(mood: string) {
    if (this.isBrowser()) {
      const entry = { mood, date: new Date().toISOString().split('T')[0] }; 
      const history = this.getMoods();

      const existingIndex = history.findIndex((m) => m.date === entry.date);
      if (existingIndex !== -1) {
        history[existingIndex] = entry;
      } else {
        history.push(entry);
      }
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    }
  }

  getMoods(): any[] {
    if (this.isBrowser()) {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }
    return []; 
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}