import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {ServiceModel} from '../models/service.model';

@Injectable({providedIn: 'root'})
export class ServiceService {
  private baseUrl = `${environment.apiUrl}/services`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: ''
    })
  };

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Get all services from API
   *
   * @param token The administrator's token session
   *
   * @returns List of services or null
   */
  getAllServices(token: string): Observable<ServiceModel[] | null> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    return this.httpClient.get<ServiceModel[] | null>(this.baseUrl, this.httpOptions);
  }
}
