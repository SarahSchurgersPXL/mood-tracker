import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { OfflineMoodSyncService } from '../../services/offline-mood-sync.service';

@Component({
  selector: 'app-day-detail',
  standalone: true,
  imports: [CommonModule], 
  template: `
    <div class="detail" *ngIf="data">
      <h2>{{ data.date }}</h2>
      <div *ngIf="data.mood">
        <img [src]="'assets/moods/' + data.mood + '.png'" [alt]="data.mood" class="mood-image" />
      </div>
      <div *ngIf="data.note">
        <p>{{ data.note }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./day-detail.component.scss']
})
export class DayDetailComponent implements OnInit {
  data: any;

  constructor(
    private route: ActivatedRoute,
    private moodService: OfflineMoodSyncService
  ) {}

  async ngOnInit() {
    const date = this.route.snapshot.paramMap.get('date')!;
    this.data = await this.moodService.getMoodByDate(date);
    if (!this.data) {
      this.data = { date, mood: null, note: null };
    }
  }
}
