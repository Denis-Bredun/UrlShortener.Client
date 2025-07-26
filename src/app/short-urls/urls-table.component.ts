import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UrlService } from '../core/services/url.service';
import { AuthService } from '../core/services/auth.service';
import { ShortUrlDto, SafeShortUrlDto } from '../shared/models';
import { AddUrlComponent } from './add-url.component';

@Component({
  selector: 'app-urls-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,

    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    AddUrlComponent
  ],
  template: `
    <div class="urls-container">
              <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Short URLs</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <app-add-url 
            *ngIf="isAuthenticated"
            (urlAdded)="onUrlAdded()"
            class="add-url-section">
          </app-add-url>

          <div class="table-container" *ngIf="!isLoading; else loadingTemplate">
            <table mat-table [dataSource]="urls" class="urls-table">
              
              <ng-container matColumnDef="originalUrl">
                <th mat-header-cell *matHeaderCellDef>Original URL</th>
                <td mat-cell *matCellDef="let url" class="url-cell">
                  <a [href]="url.originalUrl" target="_blank" class="original-url">
                    {{ url.originalUrl }}
                  </a>
                </td>
              </ng-container>

              <ng-container matColumnDef="shortCode">
                <th mat-header-cell *matHeaderCellDef>Short Code</th>
                <td mat-cell *matCellDef="let url">
                  <code class="short-code">{{ url.shortCode }}</code>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdBy">
                <th mat-header-cell *matHeaderCellDef>Created By</th>
                <td mat-cell *matCellDef="let url">{{ url.createdByUsername }}</td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Created At</th>
                <td mat-cell *matCellDef="let url">{{ url.createdAt | date: 'short' }}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let url" class="actions-cell">
                  <button 
                    mat-button 
                    color="primary"
                    (click)="viewDetails(url)"
                    *ngIf="isAuthenticated">
                    Details
                  </button>
                  
                  <button 
                    mat-button 
                    color="warn"
                    (click)="deleteUrl(url)"
                    *ngIf="canDelete(url)">
                    Delete
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="no-data" *ngIf="urls.length === 0">
              <p>No URLs found. {{ isAuthenticated ? 'Add your first URL above!' : 'Please log in to add URLs.' }}</p>
            </div>
          </div>

          <ng-template #loadingTemplate>
            <div class="loading-container">
              <mat-spinner></mat-spinner>
              <p>Loading URLs...</p>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .urls-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    .table-card {
      width: 100%;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 3;
      overflow: visible;
    }

    .table-card mat-card-header {
      margin-bottom: 0;
      padding-bottom: 16px;
    }

    .table-card mat-card-content {
      padding-top: 0;
    }

    .add-url-section {
      margin-bottom: 24px;
      display: block;
      position: relative;
      z-index: 4;
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 12px;
      margin-top: 24px;
      position: relative;
      z-index: 1;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    .urls-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .urls-table th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      padding: 20px 16px;
      border: none;
      text-align: left;
      position: sticky;
      top: 0;
      z-index: 5;
      white-space: nowrap;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .urls-table td {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: middle;
      background: white;
      position: relative;
    }

    .urls-table tr:hover td {
      background-color: #f8f9ff;
      transition: all 0.3s ease;
    }

    .url-cell {
      max-width: 400px;
      min-width: 200px;
      word-break: break-word;
      position: relative;
    }

    .original-url {
      color: #667eea;
      text-decoration: none;
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 4px 0;
      line-height: 1.4;
    }

    .original-url:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .short-code {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: 'Courier New', monospace;
      font-weight: 600;
      letter-spacing: 0.5px;
      font-size: 14px;
    }

    .actions-cell {
      white-space: nowrap;
      text-align: right;
      min-width: 180px;
    }

    .actions-cell button {
      margin-left: 8px;
      border-radius: 8px;
      min-width: 90px;
      font-weight: 500;
      font-size: 12px;
      padding: 8px 16px;
      position: relative;
      z-index: 2;
    }

    .no-data {
      text-align: center;
      padding: 60px;
      color: #666;
      font-size: 18px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 12px;
      margin: 20px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 12px;
      margin: 20px;
    }

    .loading-container p {
      margin-top: 24px;
      color: #667eea;
      font-size: 16px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .urls-container {
        padding: 16px;
      }
      
      .table-card {
        margin: 0 8px;
      }
      
      .url-cell {
        max-width: 200px;
      }
      
      .actions-cell button {
        margin-right: 8px;
        min-width: auto;
        padding: 8px 12px;
      }
    }
  `]
})
export class UrlsTableComponent implements OnInit {
  urls: (ShortUrlDto | SafeShortUrlDto)[] = [];
  displayedColumns: string[] = ['originalUrl', 'shortCode', 'createdBy', 'createdAt', 'actions'];
  isLoading = true;
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private urlService: UrlService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getUserInfo();
    
    this.authService.authState$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.currentUser = this.authService.getUserInfo();
    });

    this.urlService.urls$.subscribe(urls => {
      this.urls = urls;
      this.isLoading = false;
    });

    this.loadUrls();
  }

  loadUrls(): void {
    this.isLoading = true;
    this.urlService.getAll().subscribe({
      next: () => {
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load URLs', 'Close', { duration: 3000 });
      }
    });
  }

  viewDetails(url: ShortUrlDto | SafeShortUrlDto): void {
    if ('id' in url) {
      this.router.navigate(['/urls', url.id]);
    }
  }

  deleteUrl(url: ShortUrlDto | SafeShortUrlDto): void {
    if (!('id' in url)) return;

    if (confirm('Are you sure you want to delete this URL?')) {
      this.urlService.delete(url.id).subscribe({
        next: () => {
          this.snackBar.open('URL deleted successfully', 'Close', { duration: 3000 });
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

  canDelete(url: ShortUrlDto | SafeShortUrlDto): boolean {
    if (!this.isAuthenticated || !('id' in url)) return false;
    
    if (this.authService.isAdmin()) return true;
    
    return 'createdByUserId' in url && 
           url.createdByUserId === this.currentUser?.id;
  }

  onUrlAdded(): void {
    this.snackBar.open('URL added successfully!', 'Close', { duration: 3000 });
  }
} 