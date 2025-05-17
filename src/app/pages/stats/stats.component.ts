import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import {
  Chart,
  ChartData,
  ChartType,
  ChartOptions
} from 'chart.js';
import { OfflineMoodSyncService } from '../../services/offline-mood-sync.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <h2>Mood Statistics</h2>

    <div class="view-toggle">
      <button [class.active]="viewMode === 'month'" (click)="setViewMode('month')">Month</button>
      <button [class.active]="viewMode === 'year'" (click)="setViewMode('year')">Year</button>
    </div>

    <div class="month-selector">
      <button (click)="previousPeriod()">←</button>
      <span *ngIf="viewMode === 'month'">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
      <span *ngIf="viewMode === 'year'">{{ currentYear }}</span>
      <button *ngIf="!isCurrentPeriod()" (click)="nextPeriod()">→</button>
    </div>

    <h3>Per Mood</h3>
    <div class="chart-container">
      <ng-container *ngIf="pieChartData.datasets[0].data.length > 0; else noPieData">
        <canvas baseChart
          [data]="pieChartData"
          [type]="pieChartType"
          [options]="{ responsive: true, maintainAspectRatio: false }">
        </canvas>
      </ng-container>
      <ng-template #noPieData>
        <div class="no-data">No data</div>
      </ng-template>
    </div>

    <h3>Mood over Time</h3>
    <div class="chart-container">
      <ng-container *ngIf="lineChartData.datasets[0].data.length > 0; else noLineData">
        <canvas baseChart
          [data]="lineChartData"
          [type]="'line'"
          [options]="lineChartOptions">
        </canvas>
      </ng-container>
      <ng-template #noLineData>
        <div class="no-data">No data</div>
      </ng-template>
    </div>
  `,
  styles: [
    `
    .view-toggle {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .view-toggle button.active {
      background-color: #457B9D;
    }
    .chart-container {
      width: 100%;
      max-width: 500px;
      height: 300px;
      margin: 2rem auto;
      position: relative;
    }
    .month-selector {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
    h3 {
      margin-top: 2rem;
      text-align: center;
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    button {
      background-color: #a8dadc;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .no-data {
      text-align: center;
      color: #888;
      font-size: 1.2rem;
      margin-top: 3rem;
    }
    `
  ]
})
export class StatsComponent {
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  lineChartType: ChartType = 'line';
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value: number | string) => {
            const map: Record<string, string> = {
              '1': '😡',
              '2': '😢',
              '3': '😐',
              '4': '😊',
              '5': '😁'
            };
            return map[value.toString()] || '';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const moodMap: Record<number, string> = {
              1: 'angry',
              2: 'sad',
              3: 'neutral',
              4: 'happy',
              5: 'very happy'
            };
            const value = context.parsed.y;
            const mood = moodMap[value] || value;
            return `Mood Trend: ${mood}`;
          }
        }
      }
    }
  };

  constructor(private moodService: OfflineMoodSyncService) {
    this.loadStats();
  }

  viewMode: 'month' | 'year' = 'month';

  setViewMode(mode: 'month' | 'year') {
    this.viewMode = mode;
    this.loadStats();
  }

  isCurrentPeriod(): boolean {
    const now = new Date();
    if (this.viewMode === 'month') {
      return this.currentMonth === now.getMonth() && this.currentYear === now.getFullYear();
    } else {
      return this.currentYear === now.getFullYear();
    }
  }

  previousPeriod() {
    if (this.viewMode === 'month') {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    } else {
      this.currentYear--;
    }
    this.loadStats();
  }

  nextPeriod() {
    if (!this.isCurrentPeriod()) {
      if (this.viewMode === 'month') {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
      } else {
        this.currentYear++;
      }
      this.loadStats();
    }
  }

  async loadStats() {
    const moods = await this.moodService.getMoods();

    const moodScoreMap: Record<string, number> = {
      'angry': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very-happy': 5
    };

    const moodColorMap: Record<string, string> = {
      'angry': '#E63946',
      'sad': '#457B9D',
      'neutral': '#F1FAEE',
      'happy': '#A8DADC',
      'very-happy': '#EC9A9A'
    };

    const counts: Record<string, number> = {};
    const moodTimeline: Record<string, number> = {};

    for (const entry of moods) {
      const dateObj = new Date(entry.date);
      if (
        (this.viewMode === 'month' &&
          dateObj.getMonth() === this.currentMonth &&
          dateObj.getFullYear() === this.currentYear) ||
        (this.viewMode === 'year' &&
          dateObj.getFullYear() === this.currentYear)
      ) {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
        if (this.viewMode === 'month') {
          // Use day of month as key (1-based)
          moodTimeline[dateObj.getDate()] = moodScoreMap[entry.mood] || 0;
        } else {
          // Group by month in year view
          const timelineLabel = this.monthNames[dateObj.getMonth()];
          moodTimeline[timelineLabel] = moodScoreMap[entry.mood] || 0;
        }
      }
    }

    const labels = Object.keys(counts);

    this.pieChartData = {
      labels,
      datasets: [{
        data: Object.values(counts),
        backgroundColor: labels.map(label => moodColorMap[label] || '#cccccc')
      }]
    };

    let lineLabels: string[] = [];
    let lineData: (number | null)[] = [];
    if (this.viewMode === 'month') {
      // Get number of days in the current month
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      lineLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      lineData = lineLabels.map(day => {
        const dayNum = parseInt(day, 10);
        return moodTimeline[dayNum] ?? null;
      });
    } else {
      // Aggregate by month
      const monthScores: Record<string, number[]> = {};
      for (const entry of moods) {
        const dateObj = new Date(entry.date);
        if (dateObj.getFullYear() === this.currentYear) {
          const month = this.monthNames[dateObj.getMonth()];
          if (!monthScores[month]) monthScores[month] = [];
          monthScores[month].push(moodScoreMap[entry.mood] || 0);
        }
      }
      lineLabels = this.monthNames;
      lineData = this.monthNames.map(month => {
        const scores = monthScores[month] || [];
        if (scores.length === 0) return 0;
        return scores.reduce((a, b) => a + b, 0) / scores.length;
      });
    }

    const hasLineData = lineData.some(val => val !== null && val !== undefined && val !== 0);

    this.lineChartData = hasLineData
      ? {
          labels: lineLabels,
          datasets: [
            {
              data: lineData,
              label: 'Mood Trend',
              fill: true,
              tension: 0.4,
              borderColor: '#E63946',
              backgroundColor: '#EC9A9A',
              spanGaps: true
            }
          ]
        }
      : {
          labels: [],
          datasets: [{ data: [] }]
        };
  }
}