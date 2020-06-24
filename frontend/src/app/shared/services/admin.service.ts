import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {CredentialsModel} from '../models/credentials.model';
import {TokenSessionModel} from '../models/token-session.model';


@Injectable({providedIn: 'root'})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admins`;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Requests the API for administrator's login submission.
   *
   * @param credentials The administrator's credentials
   *
   * @returns Administrator's token session
   */
  loginAdmin(credentials: CredentialsModel): Observable<TokenSessionModel> {
    return this.httpClient.put<TokenSessionModel>(`${this.baseUrl}/login`, credentials);
  }
}
