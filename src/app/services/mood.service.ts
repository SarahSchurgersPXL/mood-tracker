import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environments';



@Injectable({ providedIn: 'root' })
export class MoodService {
  private supabase: SupabaseClient;
  constructor() {
    if (!environment.supabaseUrl || !environment.supabaseKey) {
      console.warn('❌ Supabase credentials missing!');
    }

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async logMood(mood: string): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    await this.supabase
      .from('moods')
      .upsert({ date, mood }, { onConflict: 'date' });
  }

  async getMoods(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('moods')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('❌ Supabase error:', error);
      return [];
    }

    return data || [];
  }
}