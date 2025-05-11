import { Component } from '@angular/core';
import { MoodService } from '../../services/mood.service';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-home',
  template: `
    <h2>How do you feel?</h2>
    <div>
      <img src="assets/moods/angry.png" alt="angry" (click)="log('angry')" class="mood-image mood-angry">
      <img src="assets/moods/sad.png" alt="sad" (click)="log('sad')" class="mood-image mood-sad">
      <img src="assets/moods/neutral.png" alt="neutral" (click)="log('neutral')" class="mood-image mood-neutral">
      <img src="assets/moods/happy.png" alt="happy" (click)="log('happy')" class="mood-image mood-happy">
      <img src="assets/moods/very-happy.png" alt="very happy" (click)="log('very-happy')" class="mood-image mood-very-happy">
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private moodService: MoodService) {}

  log(mood: string) {
    this.moodService.logMood(mood);

    Toastify({
      text: `Mood logged: ${mood}`,
      duration: 3000,
    }).showToast();
  }
}
