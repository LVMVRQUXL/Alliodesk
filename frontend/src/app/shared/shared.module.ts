import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';

import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {AuthenticationGuard} from './guards/authentication.guard';

@NgModule({
  imports: [HttpClientModule, CommonModule, MatToolbarModule],
  declarations: [PageNotFoundComponent, ToolbarComponent],
  exports: [HttpClientModule, PageNotFoundComponent, ToolbarComponent],
  providers: [AuthenticationGuard]
})
export class SharedModule {
}
