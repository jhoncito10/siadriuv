import { Grafico2Component } from './shared/layouts/dash-nivel3/component-graficos/grafico2/grafico2.component';
import { Grafico1Component } from './shared/layouts/dash-nivel3/component-graficos/grafico1/grafico1.component';
import { RolesComponent } from './shared/layouts/formularios-admin/roles/roles.component';
import { DashboardCentralComponent } from './shared/layouts/dashboard-central/dashboard-central.component';
import { DashNivel2Component } from './shared/layouts/dash-nivel2/dash-nivel2.component';
import { DashboardMapComponent } from './shared/layouts/dashboard-map/dashboard-map.component';
import { AuthGuard } from './shared/services/auth.guard';
import { PublicGuard } from './shared/services/public.guard';
import { Component } from '@angular/core';
import { LoginComponent } from './shared/layouts/login/login.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from 'app/shared/layouts/formularios-admin/usuarios/usuarios.component';
import { DashNivel3Component } from 'app/shared/layouts/dash-nivel3/dash-nivel3.component';

 const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'dash', component: DashboardInComponent,
   children : [
    { path: 'mapa', component: DashboardMapComponent},
    { path: 'dashnivel2', component: DashNivel2Component},
    { path: 'dashnivel3', component: DashNivel3Component,
    children: [
        {path: 'grafico1',component:Grafico1Component},
        {path: 'grafico2',component:Grafico2Component}
    ]},
    { path: 'roles', component: RolesComponent},
    { path: 'usuarios', component: UsuariosComponent},
    { path: '', pathMatch: 'full', redirectTo: 'mapa'}
    ]},
     { path: '', pathMatch: 'full', redirectTo: 'dash/mapa'}
];
export const app_routing = RouterModule.forRoot(routes, { useHash: true });

