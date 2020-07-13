import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

import {ServiceModel} from '../../shared/models/service.model';
import {ServiceService} from '../../shared/services/service.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-services-table',
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.css']
})
export class ServicesTableComponent implements OnInit {
  serviceList: ServiceModel[];
  columnsToDisplay = [
    'id',
    'name',
    'version',
    'source_url',
    'update_config_link',
    'user_id',
    'service_status_id',
    'actions'
  ];

  constructor(private cookieService: CookieService,
              private serviceService: ServiceService,
              private router: Router) {
  }

  private extractTokenFromCookie(): string {
    return `Bearer ${this.cookieService.get('TOKEN_SESSION')}`;
  }

  getAllServices(): void {
    this.serviceService.getAllServices().subscribe(
      result => {
        this.serviceList = (result === null) ? [] : result;
      },
      error => void console.error(error)
    );
  }

  ngOnInit(): void {
    this.getAllServices();
  }

  /**
   * @param serviceStatusId The service's status id
   */
  mapServiceStatusIdToString(serviceStatusId: string): string {
    switch (serviceStatusId) {
      case '1':
        return 'Validated';
      case '2':
        return 'Pending';
      case '3':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  navigateToErrorsView(): void {
    this.router.navigate(['/errors'])
      .then(res => console.log(res ? 'Successfully redirected' : 'An error has occurred during redirection'));
  }

  rejectServiceFromId(id: number): void {
    const token = this.extractTokenFromCookie();
    this.serviceService.rejectOneServiceFromId(token, id).subscribe(
      _ => void this.getAllServices(),
      error => void console.error(error)
    );
  }

  validateServiceFromId(id: number): void {
    const tokenSession = this.extractTokenFromCookie();
    this.serviceService.validateOneServiceFromId(tokenSession, id).subscribe(
      _ => void this.getAllServices(),
      error => void console.error(error)
    );
  }

}
