import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

import {ServiceModel} from '../../shared/models/service.model';
import {ServiceService} from '../../shared/services/service.service';

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
    'service_status_id'
  ];

  constructor(private cookieService: CookieService,
              private serviceService: ServiceService) {
  }

  getAllServices(): void {
    const tokenSession = `Bearer ${this.cookieService.get('TOKEN_SESSION')}`;
    this.serviceService.getAllServices(tokenSession).subscribe(
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

}
