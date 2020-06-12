import {HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";

export class HandleErrorUtil {
  /**
   * Handles an error that occurred while calling the API.
   *
   * @param error {HttpErrorResponse} The triggered error
   *
   * @returns {Observable<never>} Error observable
   */
  static handleError(error: HttpErrorResponse): Observable<never> {
    return throwError((error.error instanceof ErrorEvent) ?
      `An error has occurred: ${error.error.message}` : `API returned code ${error.status}`);
  }
}
