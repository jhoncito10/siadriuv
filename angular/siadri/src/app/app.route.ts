import { AuthGuard } from './shared/services/auth.guard';
import { PublicGuard } from './shared/services/public.guard';
import { Component } from '@angular/core';
import { LoginComponent } from './shared/layouts/login/login.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { Routes, RouterModule } from '@angular/router';

 const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate : [PublicGuard] },
  { path: 'dashin', component: DashboardInComponent, canActivate : [AuthGuard]},
  {
      path: '**',
      component: LoginComponent, canActivate : [PublicGuard]
     },
];
export const app_routing = RouterModule.forRoot(routes, { useHash: true });

