import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MoodService } from '../../services/mood.service';

@Component({
  selector: 'app-mood-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="month-navigation">
      <button (click)="changeMonth(-1)">&lt; Previous</button>
      <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      <button (click)="changeMonth(1)">Next &gt;</button>
    </div>
    <div class="mood-overview">
      <div *ngFor="let day of daysInMonth" class="day">
        <span>{{ day.date }}</span>
        <img *ngIf="day.mood" [src]="'assets/moods/' + day.mood + '.png'" [alt]="day.mood" class="mood-image" />
      </div>
    </div>
  `,
  styleUrls: ['./mood-history.component.scss']
})
export class MoodHistoryComponent {
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  daysInMonth: { date: number; mood: string | null }[] = [];

  constructor(private moodService: MoodService) {
    this.updateDaysInMonth();
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('en', { month: 'long' });
  }

  changeMonth(offset: number): void {
    this.currentMonth += offset;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.updateDaysInMonth();
  }

  updateDaysInMonth(): void {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const moods = this.moodService.getMoods();
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(this.currentYear, this.currentMonth, i + 1).toISOString().split('T')[0];
      const moodEntry = moods.find((m) => m.date.startsWith(date));
      return { date: i + 1, mood: moodEntry ? moodEntry.mood : null };
    });
  }
}
