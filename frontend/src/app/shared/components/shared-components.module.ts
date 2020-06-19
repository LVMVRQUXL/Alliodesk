import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';

import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ToolbarComponent} from './toolbar/toolbar.component';

@NgModule({
  imports: [CommonModule, MatToolbarModule],
  declarations: [PageNotFoundComponent, ToolbarComponent],
  exports: [PageNotFoundComponent, ToolbarComponent]
})
export class SharedComponentsModule {
}
