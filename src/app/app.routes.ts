import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LogMoodComponent } from './pages/log-mood/log-mood.component';
import { MoodHistoryComponent } from './pages/mood-history/mood-history.component';
import { StatsComponent } from './pages/stats/stats.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'log', component: LogMoodComponent },
    { path: 'history', component: MoodHistoryComponent },
    { path: 'stats', component: StatsComponent },
    { path: 'settings', component: SettingsComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
