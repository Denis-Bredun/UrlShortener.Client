import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { AboutService } from '../core/services/about.service';
import { AuthService } from '../core/services/auth.service';
import { AboutDto, UpdateAboutDto } from '../shared/models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="about-container">
      <mat-card class="about-card">
        <mat-card-header>
          <mat-card-title>
            About URL Shortener
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
  
          <div class="loading-container" *ngIf="isLoading">
            <mat-spinner></mat-spinner>
            <p>Loading about information...</p>
          </div>

          
          <div class="view-mode" *ngIf="!isLoading && !isEditing">
            <div class="description-content">
              <h3>Algorithm Description</h3>
              <div class="description-text" [innerHTML]="formatDescription(aboutInfo?.description || '')"></div>
            </div>

            <mat-divider *ngIf="aboutInfo"></mat-divider>

            <div class="meta-info" *ngIf="aboutInfo">
              <p class="meta-item">
                Last updated (in UTC): {{ aboutInfo.lastUpdated | date: 'medium' }}
              </p>
              <p class="meta-item">
                Updated by: {{ aboutInfo.updatedByUserName }}
              </p>
            </div>

            
            <div class="admin-actions" *ngIf="canEdit()">
              <button 
                mat-raised-button 
                color="primary" 
                (click)="startEditing()">
                Edit Description
              </button>
            </div>
          </div>

          
          <div class="edit-mode" *ngIf="!isLoading && isEditing">
            <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Algorithm Description</mat-label>
                <textarea 
                  matInput 
                  formControlName="description"
                  rows="10"
                  placeholder="Describe the URL shortener algorithm..."
                  [disabled]="isSaving">
                </textarea>
                <mat-hint>Maximum 2000 characters. HTML is supported.</mat-hint>
                <mat-error *ngIf="editForm.get('description')?.hasError('required')">
                  Description is required
                </mat-error>
                <mat-error *ngIf="editForm.get('description')?.hasError('maxlength')">
                  Description must be at most 2000 characters
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="editForm.invalid || isSaving">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>

                <button 
                  mat-button 
                  type="button" 
                  (click)="cancelEditing()"
                  [disabled]="isSaving">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          
          <div class="error-state" *ngIf="error && !isLoading">
            <div class="error-icon">Error</div>
            <h3>Error Loading Information</h3>
            <p>{{ error }}</p>
            <button mat-raised-button color="primary" (click)="loadAboutInfo()">
              Retry
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 32px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .about-card {
      width: 100%;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      overflow: hidden;
    }

    mat-card-header {
      margin-bottom: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      margin: -24px -24px 32px -24px;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 1px;
      margin: 0;
      line-height: 1.2;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      margin: 20px;
    }

    .loading-container p {
      margin-top: 24px;
      color: #667eea;
      font-size: 18px;
      font-weight: 600;
    }

    .view-mode {
      min-height: 300px;
      padding: 0 32px 32px;
      position: relative;
      z-index: 2;
    }

    .description-content h3 {
      margin: 0 0 24px 0;
      color: #667eea;
      font-weight: 700;
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      line-height: 1.3;
    }

    .description-text {
      line-height: 1.6;
      color: #333;
      white-space: pre-wrap;
      word-wrap: break-word;
      margin-bottom: 32px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      border-left: 6px solid #667eea;
      font-size: 15px;
      box-shadow: 0 4px 15px rgba(103, 126, 234, 0.1);
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .meta-info {
      margin: 32px 0;
      padding: 24px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      border: 1px solid rgba(103, 126, 234, 0.1);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 16px 0;
      color: #555;
      font-size: 16px;
      font-weight: 500;
      padding: 12px 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .admin-actions {
      margin-top: 32px;
      text-align: center;
      padding: 24px;
    }

    .admin-actions button {
      border-radius: 12px;
      padding: 16px 32px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(103, 126, 234, 0.3);
      transition: all 0.3s ease;
    }

    .admin-actions button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(103, 126, 234, 0.4);
    }

    .edit-mode {
      min-height: 400px;
      padding: 0 32px 32px;
      position: relative;
      z-index: 2;
    }

    .full-width {
      width: 100%;
      margin-bottom: 24px;
      position: relative;
      z-index: 3;
    }

    .full-width textarea {
      min-height: 200px;
      font-size: 15px;
      line-height: 1.5;
      resize: vertical;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      padding-top: 16px;
    }

    .form-actions button {
      border-radius: 12px;
      padding: 16px 32px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      min-width: 140px;
    }

    .form-actions button[color="primary"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(103, 126, 234, 0.3);
    }

    .form-actions button[color="primary"]:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(103, 126, 234, 0.4);
    }



    .error-state {
      text-align: center;
      padding: 60px 40px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      margin: 20px;
    }

    .error-icon {
      font-size: 18px;
      font-weight: bold;
      color: #ff6b6b;
      margin-bottom: 24px;
      text-transform: uppercase;
    }

    .error-state h3 {
      margin: 24px 0;
      color: #ff6b6b;
      font-size: 24px;
      font-weight: 700;
    }

    .error-state p {
      color: #666;
      margin-bottom: 32px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .about-container {
        padding: 16px;
      }

      .view-mode,
      .edit-mode {
        padding: 0 20px 20px;
      }

      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .form-actions button {
        width: 100%;
      }

      .description-text {
        padding: 20px;
        font-size: 15px;
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  aboutInfo: AboutDto | null = null;
  editForm: FormGroup;
  isLoading = true;
  isEditing = false;
  isSaving = false;
  error: string | null = null;

  constructor(
    private aboutService: AboutService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      description: ['', [
        Validators.required,
        Validators.maxLength(2000)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadAboutInfo();
  }

  loadAboutInfo(): void {
    this.isLoading = true;
    this.error = null;

    this.aboutService.getAboutInfo().subscribe({
      next: (aboutInfo) => {
        this.aboutInfo = aboutInfo;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load about information';
        this.isLoading = false;
      }
    });
  }

  canEdit(): boolean {
    return this.authService.isAuthenticated() && this.authService.isAdmin();
  }

  startEditing(): void {
    if (this.aboutInfo) {
      this.editForm.patchValue({
        description: this.aboutInfo.description
      });
    }
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editForm.reset();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.isSaving = true;

      const dto: UpdateAboutDto = {
        description: this.editForm.value.description.trim()
      };

      this.aboutService.updateAboutInfo(dto).subscribe({
        next: () => {
          this.isSaving = false;
          this.isEditing = false;
          this.snackBar.open('About information updated successfully!', 'Close', { duration: 3000 });
          this.loadAboutInfo();
        },
        error: (error) => {
          this.isSaving = false;
          const errorMessage = error.error?.message || 
                               error.error?.errors?.Description?.[0] || 
                               'Failed to update about information';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    }
  }

  formatDescription(description: string): string {
    if (!description) return 'No description available.';
    
    const cleanText = description
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/^ +/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    const paragraphs = cleanText.split(/\n\s*\n/);
    return paragraphs
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }
} 