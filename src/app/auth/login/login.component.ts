import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email') || loginForm.get('email')?.hasError('pattern')">
                Please enter a valid email format
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Enter password">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              class="full-width"
              [disabled]="loginForm.invalid || isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button routerLink="/auth/register">
            Don't have an account? Register
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .login-card {
      max-width: 450px;
      width: 100%;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      overflow: hidden;
    }

    mat-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      margin: -24px -24px 32px -24px;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    mat-card-title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
      margin: 0;
      line-height: 1.2;
    }

    mat-card-content {
      padding: 0 32px 24px;
      position: relative;
      z-index: 2;
    }

    .full-width {
      width: 100%;
      margin-bottom: 24px;
    }

    mat-form-field {
      font-size: 16px;
    }

    button[type="submit"] {
      width: 100%;
      padding: 16px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 8px 25px rgba(103, 126, 234, 0.3);
      transition: all 0.3s ease;
    }

    button[type="submit"]:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(103, 126, 234, 0.4);
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 0 32px 32px;
    }

    mat-card-actions button {
      color: #667eea;
      font-weight: 500;
    }

    @media (max-width: 500px) {
      .login-card {
        margin: 10px;
        border-radius: 16px;
      }
      
      mat-card-header {
        padding: 24px 20px 20px;
        margin: -24px -24px 24px;
      }
      
      mat-card-content,
      mat-card-actions {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(1)
      ]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      
      if (!this.isValidEmail(formValue.email)) {
        this.snackBar.open('Invalid email format', 'Close', { duration: 3000 });
        return;
      }
      
      this.isLoading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/urls']);
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Login error', 
            'Close', 
            { duration: 5000 }
          );
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
} 