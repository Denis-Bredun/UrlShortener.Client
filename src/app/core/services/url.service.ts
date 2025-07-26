import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ShortUrlDto, SafeShortUrlDto, CreateShortUrlDto } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private readonly API_URL = 'https://localhost:7001/api/urls';

  private urlsSubject = new BehaviorSubject<(ShortUrlDto | SafeShortUrlDto)[]>([]);
  public urls$ = this.urlsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<(ShortUrlDto | SafeShortUrlDto)[]> {
    return this.http.get<(ShortUrlDto | SafeShortUrlDto)[]>(this.API_URL)
      .pipe(
        tap(urls => this.urlsSubject.next(urls))
      );
  }

  getById(id: string): Observable<ShortUrlDto> {
    return this.http.get<ShortUrlDto>(`${this.API_URL}/${id}`);
  }

  create(dto: CreateShortUrlDto): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.API_URL, dto)
      .pipe(
        tap(() => this.refreshUrls())
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        tap(() => this.refreshUrls())
      );
  }

  private refreshUrls(): void {
    this.getAll().subscribe();
  }
} 