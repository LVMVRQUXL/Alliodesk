import {Injectable} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";

import {environment} from "../../../environments/environment";
import {HandleErrorUtil} from "../utils/handle-error.util";

interface AdminCredentialsModel {
  login: string,
  password: string
}

interface TokenSessionModel {
  token_session: string
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admins`;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Requests the API for administrator's login submission.
   *
   * @param credentials {AdminCredentialsModel} The administrator's credentials
   *
   * @returns {TokenSessionModel} Administrator's token session
   */
  loginAdmin(credentials: AdminCredentialsModel): Observable<TokenSessionModel> {
    return this.httpClient.put<TokenSessionModel>(`${this.baseUrl}/login`, credentials)
      .pipe(
        catchError(HandleErrorUtil.handleError)
      );
  }
}
