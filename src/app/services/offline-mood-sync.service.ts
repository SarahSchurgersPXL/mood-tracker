import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OfflineMoodSyncService {
    private supabase: SupabaseClient;
    private localKey = 'pendingMood';

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
        this.trySync();

        // automatisch synchroniseren wanneer online
        window.addEventListener('online', () => this.trySync());
    }

    async saveMood(date: string, mood: string) {
        if (!navigator.onLine) {
            localStorage.setItem(this.localKey, JSON.stringify({ date, mood }));
            console.warn('📡 Offline - mood opgeslagen in localStorage.');
            return;
        }

        await this.uploadMood({ date, mood });
    }

    private async uploadMood({ date, mood }: { date: string, mood: string }) {
        const { data, error } = await this.supabase
            .from('moods')
            .select('id')
            .eq('date', date)
            .maybeSingle();

        if (error) {
            console.error('🔴 Fout bij ophalen mood:', error.message);
            return;
        }

        if (data) {
            await this.supabase.from('moods').update({ mood }).eq('date', date);
            console.log('✅ Mood bijgewerkt');
        } else {
            await this.supabase.from('moods').insert({ date, mood });
            console.log('✅ Mood toegevoegd');
        }
    }

    async trySync() {
        if (!navigator.onLine) return;
        const stored = localStorage.getItem(this.localKey);
        if (!stored) return;

        const { date, mood } = JSON.parse(stored);
        await this.uploadMood({ date, mood });
        localStorage.removeItem(this.localKey);
        console.log('🔁 Offline mood gesynchroniseerd');
    }

    async getMoodByDate(date: string): Promise<{ date: string, mood: string } | null> {
        const { data, error } = await this.supabase
            .from('moods')
            .select('date, mood')
            .eq('date', date)
            .maybeSingle();

        if (error) {
            console.error('⚠️ getMoodByDate error:', error.message);
            return null;
        }

        return data;
    }

}