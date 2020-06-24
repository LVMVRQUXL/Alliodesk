import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorsTableComponent} from './errors-table.component';

describe('ErrorsTableComponent', () => {
  let component: ErrorsTableComponent;
  let fixture: ComponentFixture<ErrorsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorsTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
