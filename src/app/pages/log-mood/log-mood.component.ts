import { Component } from '@angular/core';
import { MoodService } from '../../services/mood.service';

@Component({
  selector: 'app-log-mood',
  template: `
    <h2>Hoe voel je je vandaag?</h2>
    <div style="display: flex; justify-content: space-around; font-size: 2rem;">
      <img src="assets/moods/angry.png" alt="kwaad" (click)="log('zeer_droevig')" class="mood-image mood-angry">
      <img src="assets/moods/sad.png" alt="droevig" (click)="log('droevig')" class="mood-image mood-sad">
      <img src="assets/moods/neutral.png" alt="neutraal" (click)="log('neutraal')" class="mood-image mood-neutral">
      <img src="assets/moods/happy.png" alt="blij" (click)="log('blij')" class="mood-image mood-happy">
      <img src="assets/moods/very-happy.png" alt="heel blij" (click)="log('heel_blij')" class="mood-image mood-very-happy">
    </div>
  `
})
export class LogMoodComponent {
  constructor(private moodService: MoodService) { }

  log(mood: string) {
    this.moodService.logMood(mood);
    alert('Mood opgeslagen!');
  }
}