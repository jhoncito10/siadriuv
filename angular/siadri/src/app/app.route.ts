import { LoginComponent } from './shared/layouts/login/login.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';


import { Routes, RouterModule } from '@angular/router';
//  componentes


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dash', component: DashboardInComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'login'}
];

export const app_routing = RouterModule.forRoot(routes, { useHash: true });
