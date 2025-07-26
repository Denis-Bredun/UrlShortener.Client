import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../core/services/auth.service';
import { UserInfoDto } from '../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="nav-content">
        <div class="brand" routerLink="/urls" [class.clickable]="isAuthenticated">
          <span>URL Shortener</span>
        </div>

        <div class="nav-links" *ngIf="isAuthenticated">
          <button mat-button routerLink="/urls" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
            URLs
          </button>
          
          <button mat-button routerLink="/about" routerLinkActive="active">
            About
          </button>
        </div>


        <div class="user-section">
          <div class="guest-actions" *ngIf="!isAuthenticated">
            <button mat-button routerLink="/about" routerLinkActive="active">
              About
            </button>
            <button mat-button routerLink="/auth/login" routerLinkActive="active">
              Login
            </button>
            <button mat-raised-button routerLink="/auth/register" routerLinkActive="active">
              Register
            </button>
          </div>

          <div class="user-menu" *ngIf="isAuthenticated">
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="username-button">
              <span class="user-avatar">{{ currentUser?.username || 'User' }}</span>
            </button>
            
            <mat-menu #userMenu="matMenu">
              <div class="user-info" mat-menu-item disabled>
                <div class="user-details">
                  <strong>{{ currentUser?.username }}</strong>
                  <small>{{ currentUser?.email }}</small>
                  <span class="role-badge" *ngIf="isAdmin">Admin</span>
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <button mat-menu-item routerLink="/about">
                <span>About</span>
              </button>
              
              <mat-divider></mat-divider>
              
              <button mat-menu-item (click)="logout()">
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      backdrop-filter: blur(20px);
      min-height: 64px;
      display: flex;
      align-items: center;
    }

    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 12px 24px;
      position: relative;
      z-index: 1001;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      font-weight: 700;
      color: white;
      text-decoration: none;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .brand.clickable {
      cursor: pointer;
    }

    .brand.clickable:hover {
      transform: scale(1.05);
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    }



    .nav-links {
      display: flex;
      gap: 16px;
    }

    .nav-links button {
      color: white;
      border-radius: 12px;
      padding: 12px 20px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .nav-links button:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
    }

    .nav-links button.active {
      background-color: rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.4) !important;
      font-weight: 700 !important;
    }

    .nav-links button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-section {
      display: flex;
      align-items: center;
    }

    .guest-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .guest-actions button {
      color: white;
      border-radius: 12px;
      padding: 12px 20px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    .guest-actions button:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
    }

    .guest-actions button[mat-raised-button] {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
    }

    .guest-actions button[mat-raised-button]:hover {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
    }

    .guest-actions button.active {
      background-color: rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.4) !important;
      font-weight: 700 !important;
    }

    .user-menu button {
      color: white;
      height: 48px;
      border-radius: 25px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      width: auto;
    }

    .username-button {
      border: 2px solid rgba(255, 255, 255, 0.3) !important;
      background: rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(10px);
    }

    .user-avatar {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .user-menu button:hover {
      background-color: rgba(255, 255, 255, 0.25) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5) !important;
    }

    .user-info {
      pointer-events: none;
      opacity: 1 !important;
      padding: 16px 20px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 8px 0;
      position: relative;
      min-width: 180px;
    }

    .user-details strong {
      font-size: 18px;
      margin-bottom: 6px;
      color: #333;
      font-weight: 700;
    }

    .user-details small {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .role-badge {
      position: absolute;
      top: 8px;
      right: 0;
      font-size: 12px;
      font-weight: bold;
      color: #ff9800;
      background: rgba(255, 152, 0, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }

    ::ng-deep .mat-mdc-menu-panel {
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.95) !important;
      z-index: 1050;
    }

    ::ng-deep .mat-mdc-menu-item {
      border-radius: 12px;
      margin: 4px 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      padding: 12px 16px !important;
      line-height: 1.4;
    }

    ::ng-deep .mat-mdc-menu-item:hover {
      background: linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      .nav-content {
        padding: 0 16px;
      }

      .brand span {
        display: none;
      }

      .nav-links {
        display: none;
      }

      .guest-actions {
        gap: 8px;
      }

      .guest-actions button {
        padding: 8px 16px;
        min-width: auto;
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .brand {
        font-size: 20px;
      }
      
      .guest-actions button span {
        display: none;
      }
      
      .user-menu button {
        height: 40px;
        padding: 0 16px;
        width: auto;
      }

      .user-avatar {
        font-size: 12px;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  currentUser: UserInfoDto | null = null;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.updateUserInfo();
    });

    this.authService.userInfo$.subscribe(userInfo => {
      this.currentUser = userInfo;
      this.isAdmin = this.authService.isAdmin();
    });

    this.updateUserInfo();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private updateUserInfo(): void {
    this.currentUser = this.authService.getUserInfo();
    this.isAdmin = this.authService.isAdmin();
  }
} 