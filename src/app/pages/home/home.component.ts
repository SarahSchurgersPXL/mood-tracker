import { Component, OnInit } from '@angular/core';
import { OfflineMoodSyncService } from '../../services/offline-mood-sync.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mood-display">
      <h2 *ngIf="!currentMood" class="header">How do you feel?</h2>

      <div *ngIf="currentMood">
        <h2 class="header">You are feeling:</h2>
        <img [src]="'assets/moods/' + currentMood + '.png'" [alt]="currentMood" class="mood-image-selected" />
        <p>Want to update your mood?</p>
      </div>
    </div>

    <div class="mood-options">
      <img src="assets/moods/angry.png" alt="angry" (click)="log('angry')" class="mood-image">
      <img src="assets/moods/sad.png" alt="sad" (click)="log('sad')" class="mood-image">
      <img src="assets/moods/neutral.png" alt="neutral" (click)="log('neutral')" class="mood-image">
      <img src="assets/moods/happy.png" alt="happy" (click)="log('happy')" class="mood-image">
      <img src="assets/moods/very-happy.png" alt="very happy" (click)="log('very-happy')" class="mood-image">
    </div>
    <div class="note-section">
      <textarea class="text" [(ngModel)]="note" rows="5" placeholder="Add notes about your day..." *ngIf="editingNote"></textarea>
      <p class="note-preview" *ngIf="!editingNote">{{ note }}</p>
      <button (click)="saveNote()" *ngIf="editingNote">{{ note ? 'Save Note' : 'Add Note' }}</button>
      <button (click)="editNote()" *ngIf="!editingNote">Edit Note</button>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentMood: string | null = null;  
  note: string = '';
  editingNote: boolean = true;

  constructor(private offlineSync: OfflineMoodSyncService) { }

  async ngOnInit(): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const moodData = await this.offlineSync.getMoodByDate(date);
    this.currentMood = moodData?.mood || null;
    this.note = moodData?.note || '';
    this.editingNote = !this.note; // If there's a note, show it; else, show textarea
  }

  async log(mood: string) {
    const date = new Date().toISOString().split('T')[0];
    await this.offlineSync.saveMood(date, mood);
    const moodData = await this.offlineSync.getMoodByDate(date);
    this.currentMood = moodData?.mood || null;
    this.note = moodData?.note || '';
  }

  async saveNote() {
    const date = new Date().toISOString().split('T')[0];
    await this.offlineSync.saveNote(date, this.note);
    const moodData = await this.offlineSync.getMoodByDate(date);
    this.currentMood = moodData?.mood || null;
    this.note = moodData?.note || '';
    this.editingNote = false;
  }

  editNote() {
    this.editingNote = true;
  }
}
