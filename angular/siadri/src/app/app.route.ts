import { DashboardMapComponent } from './shared/layouts/dashboard-map/dashboard-map.component';
import { AuthGuard } from './shared/services/auth.guard';
import { PublicGuard } from './shared/services/public.guard';
import { Component } from '@angular/core';
import { LoginComponent } from './shared/layouts/login/login.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { Routes, RouterModule } from '@angular/router';

 const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'dash', component: DashboardInComponent,
   children : [
    { path: 'mapa', component: DashboardMapComponent},
    { path: '', pathMatch: 'full', redirectTo: 'mapa'}
    ]},
     { path: '', pathMatch: 'full', redirectTo: 'dash'}
];
export const app_routing = RouterModule.forRoot(routes, { useHash: true });

