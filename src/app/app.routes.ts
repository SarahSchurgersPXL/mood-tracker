import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MoodHistoryComponent } from './pages/mood-history/mood-history.component';
import { StatsComponent } from './pages/stats/stats.component';
import { LoginComponent } from './pages/login/login.component';
import { DayDetailComponent } from './pages/day-detail/day-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'history', component: MoodHistoryComponent },
    { path: 'stats', component: StatsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'day/:date', component: DayDetailComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
