import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import {
  Chart,
  ChartData,
  ChartType,
  ChartOptions
} from 'chart.js';
import { MoodService } from '../../services/mood.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <h2>Mood Statistics</h2>

    <h3>Per Mood</h3>
    <div class="chart-container">
      <canvas baseChart
        [data]="pieChartData"
        [type]="pieChartType"
        [options]="{ responsive: true, maintainAspectRatio: false }">
      </canvas>
    </div>

    <h3>Mood over Time</h3>
    <div class="chart-container">
      <canvas baseChart
        [data]="lineChartData"
        [type]="'line'"
        [options]="lineChartOptions">
      </canvas>
    </div>
  `,
  styles: [
    `
    .chart-container {
      width: 100%;
      max-width: 500px;
      height: 300px;
      margin: 2rem auto;
      position: relative;
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

  constructor(private moodService: MoodService) {
    this.loadStats();
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

  // Add a color map for each mood
  const moodColorMap: Record<string, string> = {
    'angry': '#E63946',        // Red
    'sad': '#457B9D',          // Blue
    'neutral': '#F1FAEE',      // Gray
    'happy': '#A8DADC',        // Yellow
    'very-happy': '#EC9A9A'    // Green
  };

  const counts: Record<string, number> = {};
  const moodTimeline: Record<string, number> = {};

  for (const entry of moods) {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    const date = entry.date;
    moodTimeline[date] = moodScoreMap[entry.mood] || 0;
  }

  const labels = Object.keys(counts);

  this.pieChartData = {
    labels,
    datasets: [{
      data: Object.values(counts),
      // Assign colors based on the mood label order
      backgroundColor: labels.map(label => moodColorMap[label] || '#cccccc')
    }]
  };

  this.lineChartData = {
    labels: Object.keys(moodTimeline),
    datasets: [
      {
        data: Object.values(moodTimeline),
        label: 'Mood Trend',
        fill: true,
        tension: 0.4,
        borderColor: '#A8DADC',
        backgroundColor: '#F1FAEE',
      }
    ]
  };
}
}