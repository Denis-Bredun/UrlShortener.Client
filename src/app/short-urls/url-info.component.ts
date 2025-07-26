import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { UrlService } from '../core/services/url.service';
import { AuthService } from '../core/services/auth.service';
import { ShortUrlDto } from '../shared/models';

@Component({
  selector: 'app-url-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="url-info-container" *ngIf="!isLoading; else loadingTemplate">
      <div class="header-actions">
        <button mat-button (click)="goBack()">
          Back to URLs
        </button>
      </div>

      <mat-card class="url-info-card" *ngIf="urlInfo">
        <mat-card-header>
          <mat-card-title>
            URL Information
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="info-section">
            <h3>Original URL</h3>
            <div class="url-display">
              <a [href]="urlInfo.originalUrl" target="_blank" class="original-url">
                {{ urlInfo.originalUrl }}
                <span class="external-link">(open)</span>
              </a>
            </div>
          </div>

          <mat-divider></mat-divider>


          <div class="info-section">
            <h3>Short URL</h3>
            <div class="short-url-display">
              <code class="short-code">{{ getFullShortUrl() }}</code>
              <button 
                mat-button 
                (click)="copyToClipboard(getFullShortUrl())"
                matTooltip="Copy to clipboard">
                Copy
              </button>
            </div>
          </div>

          <mat-divider></mat-divider>


          <div class="info-section">
            <h3>Details</h3>
            <div class="metadata-grid">
              <div class="metadata-item">
                <mat-chip-set>
                  <mat-chip>
                    Created by: {{ urlInfo.createdByUsername }}
                  </mat-chip>
                </mat-chip-set>
              </div>
              
              <div class="metadata-item">
                <mat-chip-set>
                  <mat-chip>
                    Created: {{ urlInfo.createdAt | date: 'medium' }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="metadata-item">
                <mat-chip-set>
                  <mat-chip>
                    Short Code: {{ urlInfo.shortCode }}
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="metadata-item">
                <mat-chip-set>
                  <mat-chip>
                    ID: {{ urlInfo.id }}
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button (click)="goBack()">
            Back
          </button>
          
          <button 
            mat-button 
            color="primary"
            (click)="openOriginalUrl()">
            Open Original URL
          </button>

          <button 
            mat-button 
            color="warn"
            (click)="deleteUrl()"
            *ngIf="canDelete()">
            Delete
          </button>
        </mat-card-actions>
      </mat-card>


      <mat-card class="error-card" *ngIf="error">
        <mat-card-content>
          <div class="error-content">
            <div class="error-icon">Error</div>
            <h3>Error Loading URL</h3>
            <p>{{ error }}</p>
            <button mat-raised-button color="primary" (click)="goBack()">
              Back to URLs
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #loadingTemplate>
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading URL information...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .url-info-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    .header-actions {
      margin-bottom: 32px;
      position: relative;
      z-index: 10;
    }

    .header-actions button {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      z-index: 11;
    }

    .url-info-card {
      width: 100%;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      overflow: hidden;
    }

    .info-section {
      margin: 24px 0;
      padding: 24px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      position: relative;
      z-index: 3;
    }

    .info-section h3 {
      margin: 0 0 20px 0;
      color: #667eea;
      font-weight: 700;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
      line-height: 1.3;
    }

    .url-display {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .original-url {
      color: #667eea;
      text-decoration: none;
      word-break: break-all;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 16px;
      padding: 12px 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(103, 126, 234, 0.1);
      transition: all 0.3s ease;
    }

    .original-url:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(103, 126, 234, 0.2);
      color: #764ba2;
    }

    .external-link {
      font-size: 20px;
      opacity: 0.8;
    }

    .short-url-display {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .short-code {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-family: 'Courier New', monospace;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 1px;
      flex: 1;
      min-width: 200px;
      box-shadow: 0 4px 15px rgba(103, 126, 234, 0.3);
    }

    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .metadata-item mat-chip {
      width: 100%;
      padding: 16px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
    }

    mat-card-header {
      margin-bottom: 24px;
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
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1px;
      margin: 0;
      line-height: 1.2;
    }

    mat-card-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      padding: 24px 32px 32px;
      justify-content: center;
    }

    mat-card-actions button {
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    mat-card-actions button[color="primary"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(103, 126, 234, 0.3);
    }

    mat-card-actions button[color="warn"] {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }

    mat-card-actions button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(103, 126, 234, 0.4);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      margin: 20px;
      backdrop-filter: blur(10px);
    }

    .loading-container p {
      margin-top: 24px;
      color: #667eea;
      font-size: 18px;
      font-weight: 600;
    }

    .error-card {
      width: 100%;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 107, 107, 0.2);
    }

    .error-content {
      text-align: center;
      padding: 60px 40px;
    }

    .error-icon {
      font-size: 18px;
      font-weight: bold;
      color: #ff6b6b;
      margin-bottom: 24px;
      text-transform: uppercase;
    }

    .error-content h3 {
      margin: 24px 0;
      color: #ff6b6b;
      font-size: 24px;
      font-weight: 700;
    }

    .error-content p {
      color: #666;
      margin-bottom: 32px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .url-info-container {
        padding: 16px;
      }

      .metadata-grid {
        grid-template-columns: 1fr;
      }

      mat-card-actions {
        flex-direction: column;
        padding: 20px;
      }

      mat-card-actions button {
        width: 100%;
      }

      .short-code {
        font-size: 14px;
        min-width: auto;
      }
    }
  `]
})
export class UrlInfoComponent implements OnInit {
  urlInfo: ShortUrlDto | null = null;
  isLoading = true;
  error: string | null = null;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserInfo();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUrlInfo(id);
    } else {
      this.error = 'Invalid URL ID';
      this.isLoading = false;
    }
  }

  loadUrlInfo(id: string): void {
    this.urlService.getById(id).subscribe({
      next: (urlInfo) => {
        this.urlInfo = urlInfo;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load URL information';
        this.isLoading = false;
      }
    });
  }

  getFullShortUrl(): string {
    if (!this.urlInfo) return '';
    return `https://localhost:7001/${this.urlInfo.shortCode}`;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Short URL copied to clipboard!', 'Close', { duration: 2000 });
    }).catch(() => {
      this.snackBar.open('Failed to copy URL', 'Close', { duration: 2000 });
    });
  }

  openOriginalUrl(): void {
    if (this.urlInfo) {
      window.open(this.urlInfo.originalUrl, '_blank');
    }
  }

  canDelete(): boolean {
    if (!this.urlInfo || !this.currentUser) return false;
    
    if (this.authService.isAdmin()) return true;
    
    return this.urlInfo.createdByUserId === this.currentUser.id;
  }

  deleteUrl(): void {
    if (!this.urlInfo) return;

    if (confirm('Are you sure you want to delete this URL?')) {
      this.urlService.delete(this.urlInfo.id).subscribe({
        next: () => {
          this.snackBar.open('URL deleted successfully', 'Close', { duration: 3000 });
          this.goBack();
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Failed to delete URL', 
            'Close', 
            { duration: 3000 }
          );
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/urls']);
  }
} 