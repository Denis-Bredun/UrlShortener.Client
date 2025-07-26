import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'urls',
    canActivate: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./short-urls/urls-table.component').then(m => m.UrlsTableComponent) },
      { path: ':id', loadComponent: () => import('./short-urls/url-info.component').then(m => m.UrlInfoComponent) }
    ]
  },
  { 
    path: 'about', 
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) 
  },
  { path: '', redirectTo: '/urls', pathMatch: 'full' },
  { path: '**', redirectTo: '/urls' }
];
