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
  selector: 'app-register',
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
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter email">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email') || registerForm.get('email')?.hasError('pattern')">
                Please enter a valid email format
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="Enter username">
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                Minimum 3 characters
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.hasError('maxlength')">
                Maximum 50 characters
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.hasError('pattern')">
                Only letters, numbers and underscore
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Enter password">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Minimum 6 characters
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('pattern')">
                Password must contain: uppercase letter, lowercase letter, number and special character
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              class="full-width"
              [disabled]="registerForm.invalid || isLoading">
              {{ isLoading ? 'Registering...' : 'Register' }}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button routerLink="/auth/login">
            Already have an account? Login
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .register-card {
      max-width: 400px;
      width: 100%;
      margin: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 16px;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]],
      username: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/)
      ]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      
      if (!this.isValidEmail(formValue.email)) {
        this.snackBar.open('Invalid email format', 'Close', { duration: 3000 });
        return;
      }
      
      if (!this.isValidUsername(formValue.username)) {
        this.snackBar.open('Invalid username format', 'Close', { duration: 3000 });
        return;
      }
      
      if (!this.isValidPassword(formValue.password)) {
        this.snackBar.open('Password does not meet security requirements', 'Close', { duration: 3000 });
        return;
      }
      
      this.isLoading = true;
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/urls']);
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Registration error', 
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

  private isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return usernameRegex.test(username);
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    return passwordRegex.test(password);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
} 