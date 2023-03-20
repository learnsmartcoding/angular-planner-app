import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getUserProfile(): Observable<UserProfile> {
    const url = `${this.apiUrl}/${environment.apiEndpoints.accounts.getUserProfile}`;
    return this.get(url);
  }
  saveUserProfile(): Observable<any> {
    const url = `${this.apiUrl}/${environment.apiEndpoints.accounts.saveProfile}`;
    return this.http.post(url, {});
  }

  private get<T>(url: string, options?: any): Observable<T> {
    return <Observable<T>>(
      this.http.get(url, options).pipe(map((res) => this.extractData<T>(res)))
    );
  }
  private getArrary<T>(url: string, options?: any): Observable<T[]> {
    return <Observable<T[]>>(
      this.http.get(url, options).pipe(map((res) => this.extractData<T[]>(res)))
    );
  }

  private extractData<T>(res: any) {
    if (res && (res.status < 200 || res.status >= 300)) {
      throw new Error('Bad response status: ' + res.status);
    }
    return (res || {}) as T;
  }
}
