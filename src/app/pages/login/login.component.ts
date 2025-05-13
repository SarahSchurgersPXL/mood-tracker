import { Component } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="login()">
      <input [(ngModel)]="email" name="email" placeholder="Email" required />
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
    <p *ngIf="error">{{ error }}</p>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService) {}

  async login() {
    try {
      await this.auth.signIn(this.email, this.password);
      // redirect of toast
    } catch (e: any) {
      this.error = e.message;
    }
  }
}
