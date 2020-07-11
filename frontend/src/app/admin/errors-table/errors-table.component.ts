import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

import {ErrorsService} from '../../shared/services/errors.service';
import {ErrorModel} from '../../shared/models/error.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-errors-table',
  templateUrl: './errors-table.component.html',
  styleUrls: ['./errors-table.component.css']
})
export class ErrorsTableComponent implements OnInit {
  errorList: ErrorModel[];
  columnsToDisplay = ['id', 'message', 'user_id', 'service_id'];

  constructor(private errorsService: ErrorsService,
              private cookieService: CookieService,
              private router: Router) {
  }

  /**
   * Get all errors from API
   */
  private _getErrorsFromAPI(): void {
    const tokenSession = `Bearer ${this.cookieService.get('TOKEN_SESSION')}`;
    this.errorsService.getAllErrors(tokenSession).subscribe(
      result => this.errorList = (result === null) ? [] : result,
      error => console.error(error)
    );
  }

  ngOnInit(): void {
    this._getErrorsFromAPI();
  }

  navigateToServicesView(): void {
    this.router.navigate(['/services'])
      .then(res => console.log(res ? 'Successfully redirected' : 'An error has occurred during redirection'));
  }

  refreshErrorsList(): void {
    this._getErrorsFromAPI();
  }
}
