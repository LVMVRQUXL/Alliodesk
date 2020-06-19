import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ErrorsTableComponent} from './errors-table/errors-table.component';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from '../shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: 'errors', component: ErrorsTableComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
