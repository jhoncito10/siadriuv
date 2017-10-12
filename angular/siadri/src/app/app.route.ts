import { RightPanelComponent } from './shared/layouts/right-panel/right-panel.component';
import { Component } from '@angular/core';
import { LoginComponent } from './shared/layouts/login/login.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'dash', component: DashboardInComponent,
  children:
  [{ path: 'rigth', component: RightPanelComponent }
  ]},
  { path: '**', pathMatch: 'full', redirectTo: 'login'}
];
export const app_routing = RouterModule.forRoot(routes, { useHash: true });
