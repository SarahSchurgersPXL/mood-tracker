import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineMoodSyncService } from '../../services/offline-mood-sync.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mood-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-toggle">
      <button [class.active]="viewMode === 'month'" (click)="setViewMode('month')">Month</button>
      <button [class.active]="viewMode === 'year'" (click)="setViewMode('year')">Year</button>
    </div>
    <ng-container *ngIf="viewMode === 'month'">
      <div class="month-navigation">
        <button (click)="changeMonth(-1)">←</button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button *ngIf="!isCurrentMonth()" (click)="changeMonth(1)">→</button>
      </div>
      <div class="mood-overview">
        <div
          *ngFor="let day of daysInMonth"
          class="day"
          (click)="goToDayDetail(day.date)"
          style="cursor:pointer"
        >
          <span>{{ day.date }}</span>
          <img *ngIf="day.mood" [src]="'assets/moods/' + day.mood + '.png'" [alt]="day.mood" class="mood-image" />
        </div>
      </div>
    </ng-container>
    <ng-container *ngIf="viewMode === 'year'">
      <div class="year-navigation">
        <button (click)="changeYear(-1)">←</button>
        <h2>{{ currentYear }}</h2>
        <button *ngIf="!isCurrentYear()" (click)="changeYear(1)">→</button>
      </div>
      <div class="year-table">
        <div class="table-row header-row">
          <div class="table-cell day-header"></div>
          <div class="table-cell month-header" *ngFor="let month of months">{{ month }}</div>
        </div>
        <div class="table-row" *ngFor="let day of daysInYear">
          <div class="table-cell day-header">{{ day }}</div>
          <div class="table-cell" *ngFor="let monthIdx of monthIndexes">
            <ng-container *ngIf="yearDays[monthIdx][day - 1]">
              <img
                *ngIf="yearDays[monthIdx][day - 1].mood"
                [src]="'assets/moods/' + yearDays[monthIdx][day - 1].mood + '.png'"
                [alt]="yearDays[monthIdx][day - 1].mood"
                class="mood-image-inline"
              />
              <span *ngIf="!yearDays[monthIdx][day - 1].mood"></span>
            </ng-container>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./mood-history.component.scss']
})
export class MoodHistoryComponent implements OnInit {
  viewMode: 'month' | 'year' = 'month';
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  daysInMonth: { date: number; mood: string | null }[] = [];
  months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];
  yearMoods: (string | null)[] = [];
  yearDays: { date: number, mood: string | null }[][] = [];

  constructor(private moodService: OfflineMoodSyncService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.updateView();
  }

  setViewMode(mode: 'month' | 'year') {
    this.viewMode = mode;
    this.updateView();
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('en', { month: 'long' });
  }

  isCurrentMonth(): boolean {
    const now = new Date();
    return this.currentMonth === now.getMonth() && this.currentYear === now.getFullYear();
  }

  changeMonth(offset: number): void {
    const now = new Date();
    const newMonth = this.currentMonth + offset;
    const newDate = new Date(this.currentYear, newMonth);
    if (newDate > now) return;
    this.currentMonth = newDate.getMonth();
    this.currentYear = newDate.getFullYear();
    this.updateDaysInMonth();
  }

  async updateView(): Promise<void> {
    if (this.viewMode === 'month') {
      await this.updateDaysInMonth();
    } else {
      await this.updateYearDays();
    }
  }

  async updateDaysInMonth(): Promise<void> {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const moods = await this.moodService.getMoods();

    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(this.currentYear, this.currentMonth, i + 1).toISOString().split('T')[0];
      const moodEntry = moods.find((m: any) => m.date.startsWith(date));
      return { date: i + 1, mood: moodEntry ? moodEntry.mood : null };
    });
  }

  async updateYearDays(): Promise<void> {
    const moods = await this.moodService.getMoods();
    this.yearDays = this.months.map((_, monthIdx) => {
      const daysInMonth = new Date(this.currentYear, monthIdx + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, dayIdx) => {
        const date = new Date(this.currentYear, monthIdx, dayIdx + 1).toISOString().split('T')[0];
        const moodEntry = moods.find((m: any) => m.date.startsWith(date));
        return { date: dayIdx + 1, mood: moodEntry ? moodEntry.mood : null };
      });
    });
  }

  daysInYear = Array.from({ length: 31 }, (_, i) => i + 1);

  monthIndexes = Array.from({ length: 12 }, (_, i) => i);

  changeYear(offset: number) {
    const newYear = this.currentYear + offset;
    const now = new Date();
    if (newYear > now.getFullYear()) return;
    this.currentYear = newYear;
    this.updateView();
  }

  isCurrentYear(): boolean {
    return this.currentYear === new Date().getFullYear();
  }

  goToDayDetail(day: number) {
    // Format date as yyyy-mm-dd
    const date = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    this.router.navigate(['/day', date]);
  }
}
