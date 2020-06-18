import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';

export interface ErrorModel {
  id: number;
  message: string;
  user_id: number;
  service_id: number;
}

@Injectable({providedIn: 'root'})
export class ErrorsService {
  private baseUrl = `${environment.apiUrl}/errors`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: ''
    })
  };

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Get all errors from API
   *
   * @param token The administrator's token session
   *
   * @returns List of errors or null
   */
  getAllErrors(token: string): Observable<ErrorModel[] | null> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.httpClient.get<ErrorModel[] | null>(this.baseUrl, this.httpOptions);
  }
}
