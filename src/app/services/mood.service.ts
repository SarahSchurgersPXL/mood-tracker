import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class MoodService {
  private supabase: SupabaseClient;
  constructor() {
    if (!environment.supabaseUrl || !environment.supabaseKey) {
      console.warn('❌ Supabase credentials missing!');
    }

    this.supabase = createClient(environment.supabaseUrl!, environment.supabaseKey!);
  }

  async logMood(mood: string): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from('moods')
      .select('*')
      .eq('date', date)
      .maybeSingle();

    if (error) {
      console.error('❌ Fout bij ophalen mood:', error.message);
      return;
    }

    if (data) {
      console.log('✅ Mood bestaat al:', data);

      // Stap 2: mood bestaat → update
      const { error: updateError } = await this.supabase
        .from('moods')
        .update({ mood })
        .eq('date', date);

      if (updateError) {
        console.error('❌ Fout bij updaten mood:', updateError.message);
      } else {
        console.log('✅ Mood bijgewerkt');
      }

    } else {
      // Stap 3: mood bestaat nog niet → insert
      const { error: insertError } = await this.supabase
        .from('moods')
        .insert({ date, mood });

      if (insertError) {
        console.error('❌ Fout bij invoegen mood:', insertError.message);
      } else {
        console.log('✅ Mood toegevoegd');
      }
    }
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