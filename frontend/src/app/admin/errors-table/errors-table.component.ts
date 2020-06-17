import {Component, OnInit} from '@angular/core';

interface Error {
  id: number,
  message: string,
  user_id: number,
  service_id: number
}

@Component({
  selector: 'app-errors-table',
  templateUrl: './errors-table.component.html',
  styleUrls: ['./errors-table.component.css']
})
export class ErrorsTableComponent implements OnInit {
  errorList: Error[];
  columnsToDisplay = ['id', 'message', 'user_id', 'service_id'];

  constructor() {
  }

  private static generateFakeErrors(limit: number): Error[] {
    const errors = [];
    for (let i = 1; i <= limit; i++)
      errors.push({
        id: i,
        message: 'test',
        user_id: i,
        service_id: i
      });
    return errors;
  }

  ngOnInit(): void {
    this.errorList = ErrorsTableComponent.generateFakeErrors(20);
  }

  refreshErrorsList(): void {
    this.errorList = ErrorsTableComponent.generateFakeErrors(30);
  }
}
