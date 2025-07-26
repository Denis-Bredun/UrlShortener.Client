import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { UrlService } from '../core/services/url.service';
import { CreateShortUrlDto } from '../shared/models';

@Component({
  selector: 'app-add-url',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card class="add-url-card">
              <mat-card-header>
          <mat-card-title>
            Add New URL
          </mat-card-title>
        </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="addUrlForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Original URL</mat-label>
            <input 
              matInput 
              formControlName="originalUrl" 
              type="url" 
              placeholder="https://example.com"
              [disabled]="isLoading">
            <mat-error *ngIf="addUrlForm.get('originalUrl')?.hasError('required')">
              URL is required
            </mat-error>
            <mat-error *ngIf="addUrlForm.get('originalUrl')?.hasError('url')">
              Please enter a valid URL (must start with http:// or https://)
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              [disabled]="addUrlForm.invalid || isLoading">
              {{ isLoading ? 'Adding...' : 'Add Short URL' }}
            </button>
            
            <button 
              mat-button 
              type="button" 
              (click)="clearForm()"
              [disabled]="isLoading">
              Clear
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .add-url-card {
      margin-bottom: 32px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(103, 126, 234, 0.15);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(103, 126, 234, 0.1);
      overflow: visible;
      position: relative;
      z-index: 10;
    }

    .full-width {
      width: 100%;
      margin-bottom: 24px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      padding-top: 8px;
    }

    .form-actions button {
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    .form-actions button[color="primary"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(103, 126, 234, 0.3);
    }

    .form-actions button[color="primary"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(103, 126, 234, 0.4);
    }



    mat-card-header {
      margin-bottom: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      margin: -24px -24px 24px -24px;
      position: relative;
      z-index: 1;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      padding: 0;
      line-height: 1.2;
    }

    mat-card-content {
      padding: 0 24px 24px;
      position: relative;
      z-index: 2;
    }

    mat-form-field {
      font-size: 16px;
    }

    @media (max-width: 600px) {
      .form-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      
      .form-actions button {
        width: 100%;
        padding: 14px 20px;
      }
    }
  `]
})
export class AddUrlComponent {
  @Output() urlAdded = new EventEmitter<void>();
  
  addUrlForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private urlService: UrlService,
    private snackBar: MatSnackBar
  ) {
    this.addUrlForm = this.fb.group({
      originalUrl: ['', [
        Validators.required,
        this.urlValidator
      ]]
    });
  }

  onSubmit(): void {
    if (this.addUrlForm.valid) {
      this.isLoading = true;
      
      const dto: CreateShortUrlDto = {
        originalUrl: this.addUrlForm.value.originalUrl.trim()
      };

      this.urlService.create(dto).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.addUrlForm.reset();
          this.urlAdded.emit();
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 
                               error.error?.errors?.OriginalUrl?.[0] || 
                               'Failed to create short URL';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  clearForm(): void {
    this.addUrlForm.reset();
  }

  private urlValidator(control: any) {
    if (!control.value) return null;
    
    const url = control.value.trim();
    
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return { url: true };
      }
      return null;
    } catch {
      return { url: true };
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addUrlForm.controls).forEach(key => {
      const control = this.addUrlForm.get(key);
      control?.markAsTouched();
    });
  }
} 