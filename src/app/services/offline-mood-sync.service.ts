import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.prod.secret';

@Injectable({ providedIn: 'root' })
export class OfflineMoodSyncService {
    private supabase: SupabaseClient;
    private localKey = 'pendingMoods';

    constructor() {
        this.supabase = createClient(environment.supabaseUrl!, environment.supabaseKey!);
        this.trySync();

        // automatisch synchroniseren wanneer online
        window.addEventListener('online', () => this.trySync());
    }

    async saveMood(date: string, mood: string) {
        if (!navigator.onLine) {
            const pending = JSON.parse(localStorage.getItem(this.localKey) || '{}');
            pending[date] = { ...(pending[date] || {}), mood };
            localStorage.setItem(this.localKey, JSON.stringify(pending));
            console.warn('📡 Offline - mood opgeslagen in localStorage.');
            return;
        }

        await this.uploadMood({ date, mood });
    }

    async saveNote(date: string, note: string) {
        if (!navigator.onLine) {
            const pending = JSON.parse(localStorage.getItem(this.localKey) || '{}');
            pending[date] = { ...(pending[date] || {}), note };
            localStorage.setItem(this.localKey, JSON.stringify(pending));
            console.warn('📡 Offline - note opgeslagen in localStorage.');
            return;
        }

        await this.uploadNote({ date, note });
    }

    private async uploadMood({ date, mood }: { date: string, mood: string }) {
        const { data, error } = await this.supabase
            .from('moods')
            .select('id')
            .eq('date', date)
            .maybeSingle();

        if (error) {
            console.error('Fout bij ophalen mood:', error.message);
            return;
        }

        if (data) {
            await this.supabase.from('moods').update({ mood }).eq('date', date);
            console.log('Mood bijgewerkt');
        } else {
            await this.supabase.from('moods').insert({ date, mood });
            console.log('Mood toegevoegd');
        }
    }

    private async uploadNote({ date, note }: { date: string, note: string }) {
        const { data, error } = await this.supabase
            .from('moods')
            .select('id')
            .eq('date', date)
            .maybeSingle();

        if (error) {
            console.error('Fout bij ophalen mood:', error.message);
            return;
        }

        if (data) {
            await this.supabase.from('moods').update({ note }).eq('date', date);
            console.log('Note bijgewerkt');
        } else {
            await this.supabase.from('moods').insert({ date, note });
            console.log('Mood toegevoegd');
        }
    }

    async trySync() {
        if (!navigator.onLine) return;
        const stored = localStorage.getItem(this.localKey);
        if (!stored) return;

        const pending = JSON.parse(stored);
        for (const date of Object.keys(pending)) {
            const { mood, note } = pending[date];
            if (mood !== undefined) await this.uploadMood({ date, mood });
            if (note !== undefined) await this.uploadNote({ date, note });
        }
        localStorage.removeItem(this.localKey);
        console.log('Offline moods gesynchroniseerd');
    }

    async getMoodByDate(date: string): Promise<{ date: string, mood: string, note: string } | null> {
        const { data, error } = await this.supabase
            .from('moods')
            .select('date, mood, note')
            .eq('date', date)
            .maybeSingle();

        if (error) {
            console.error('getMoodByDate error:', error.message);
            return null;
        }

        return data;
    }

    async getMoods(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('moods')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    return data || [];
  }

}