import { Component, OnInit } from '@angular/core';
import Toastify from 'toastify-js';
import { OfflineMoodSyncService } from '../../services/offline-mood-sync.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mood-display">
      <h2 *ngIf="!currentMood" class="header">How do you feel?</h2>

      <div *ngIf="currentMood">
        <h2 class="header">You are feeling:</h2>
        <img [src]="'assets/moods/' + currentMood + '.png'" [alt]="currentMood" class="mood-image2" />
        <p>Want to update your mood?</p>
      </div>
    </div>

    <div class="mood-options">
      <img src="assets/moods/angry.png" alt="angry" (click)="log('angry')" class="mood-image mood-angry">
      <img src="assets/moods/sad.png" alt="sad" (click)="log('sad')" class="mood-image mood-sad">
      <img src="assets/moods/neutral.png" alt="neutral" (click)="log('neutral')" class="mood-image mood-neutral">
      <img src="assets/moods/happy.png" alt="happy" (click)="log('happy')" class="mood-image mood-happy">
      <img src="assets/moods/very-happy.png" alt="very happy" (click)="log('very-happy')" class="mood-image mood-very-happy">
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentMood: string | null = null;

  constructor(private offlineSync: OfflineMoodSyncService) { }

  async ngOnInit(): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const moodData = await this.offlineSync.getMoodByDate(date);
    this.currentMood = moodData?.mood || null;
  }

  log(mood: string) {
    const date = new Date().toISOString().split('T')[0];
    this.offlineSync.saveMood(date, mood);
    this.currentMood = mood;

    Toastify({
      text: `Mood logged: ${mood}`,
      duration: 3000,
    }).showToast();
  }
}
