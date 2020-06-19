import {NgModule} from '@angular/core';

import {HttpClientModule} from '@angular/common/http';

import {SharedComponentsModule} from './components/shared-components.module';

@NgModule({
  imports: [HttpClientModule],
  exports: [HttpClientModule, SharedComponentsModule]
})
export class SharedModule {
}
