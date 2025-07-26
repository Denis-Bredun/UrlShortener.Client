import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { AuthResponseDto, LoginDto, RegisterDto, UserInfoDto } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7001/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';

  private authStateSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authState$ = this.authStateSubject.asObservable();

  private userInfoSubject = new BehaviorSubject<UserInfoDto | null>(this.getUserInfo());
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.API_URL}/register`, dto)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          console.error('Register error:', error);
          throw error;
        })
      );
  }

  login(dto: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.API_URL}/login`, dto)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.authStateSubject.next(false);
    this.userInfoSubject.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.role === 'Admin';
  }

  getCurrentUser(): Observable<UserInfoDto> {
    return this.http.get<UserInfoDto>(`${this.API_URL}/me`)
      .pipe(
        tap(userInfo => {
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
          this.userInfoSubject.next(userInfo);
        })
      );
  }

  getUserInfo(): UserInfoDto | null {
    const userInfoStr = sessionStorage.getItem(this.USER_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  }

  private handleAuthResponse(response: AuthResponseDto): void {
    sessionStorage.setItem(this.TOKEN_KEY, response.token);
    this.authStateSubject.next(true);
    this.getCurrentUser().subscribe();
  }
} 