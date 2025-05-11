import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MoodService {
  private storageKey = 'moods';

  logMood(mood: string) {
    const entry = { mood, date: new Date().toISOString() };
    const history = this.getMoods();
    history.push(entry);
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  getMoods(): any[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
}