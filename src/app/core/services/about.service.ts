import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AboutDto, UpdateAboutDto } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private readonly API_URL = 'https://localhost:7001/api/about';

  constructor(private http: HttpClient) {}

  getAboutInfo(): Observable<AboutDto> {
    return this.http.get<AboutDto>(this.API_URL);
  }

  updateAboutInfo(dto: UpdateAboutDto): Observable<void> {
    return this.http.put<void>(this.API_URL, dto);
  }
} 