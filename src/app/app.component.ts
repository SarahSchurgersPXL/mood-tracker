import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'mood-tracker';
  isLoggedIn = false;
  currentPath = '';

  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.urlAfterRedirects;
      }
    });

    const { data: sessionData } = await this.auth.getSession();
    this.isLoggedIn = !!sessionData.session;

    this.auth.onAuthStateChange((event, session) => {
      this.isLoggedIn = !!session;

      // ✅ Only redirect if NOT on login page
      if (!session && this.currentPath !== '/login') {
        this.router.navigate(['/login']);
      }

      // ✅ Automatically go to home if just logged in
      if (session && this.currentPath === '/login') {
        this.router.navigate(['/']);
      }
    });
  }
  async logout(event: Event) {
    try {
      event.preventDefault();
      await this.auth.signOut();
      this.isLoggedIn = false; // Update state immediately
      this.router.navigate(['/login']); // Redirect to login page
    } catch (err: any) {
      console.error('Logout failed:', err.message);
    }
  }
}