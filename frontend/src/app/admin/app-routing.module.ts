import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ErrorsTableComponent} from './errors-table/errors-table.component';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from '../shared/components/page-not-found/page-not-found.component';
import {AuthenticationGuard} from '../shared/guards/authentication.guard';
import {ServicesTableComponent} from './services-table/services-table.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'errors', component: ErrorsTableComponent, canActivate: [AuthenticationGuard]},
  {path: 'services', component: ServicesTableComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
