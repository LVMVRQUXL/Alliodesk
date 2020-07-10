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
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) {
  }

  private addTokenInHeaders(token: string): HttpHeaders {
    return this.httpOptions.headers.append('Authorization', token);
  }

  getAllServices(): Observable<ServiceModel[] | null> {
    return this.httpClient.get<ServiceModel[] | null>(this.baseUrl);
  }

  validateOneServiceFromId(token: string, id: number): Observable<null> {
    const options = {headers: this.addTokenInHeaders(token)};
    const endpoint = `${this.baseUrl}/${id}/validate`;

    return this.httpClient.put<null>(endpoint, null, options);
  }
}
