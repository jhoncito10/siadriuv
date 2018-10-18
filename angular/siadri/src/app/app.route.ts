import { ComponentInvestigacionComponent } from './shared/layouts/dash-nivel3/component-investigacion/component-investigacion.component';
import { UnivalleGuard } from './shared/services/univalle.guard';
import { RenovacionesComponent } from './shared/layouts/dash-nivel2/renovaciones/renovaciones.component';
import { InscripcionesComponent } from './shared/layouts/dash-nivel2/inscripciones/inscripciones.component';
import { AdminGuard } from './shared/services/admin.guard';
import { Nivel3Guard } from './shared/services/nivel3.guard';
import { Grafico2Component } from './shared/layouts/dash-nivel3/component-graficos/grafico2/grafico2.component';
import { Grafico1Component } from './shared/layouts/dash-nivel3/component-graficos/grafico1/grafico1.component';
import { RolesComponent } from './shared/layouts/formularios-admin/roles/roles.component';
import { DashNivel2Component } from './shared/layouts/dash-nivel2/dash-nivel2.component';
import { DashboardMapComponent } from './shared/layouts/dashboard-map/dashboard-map.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from 'app/shared/layouts/formularios-admin/usuarios/usuarios.component';
import { DashNivel3Component } from 'app/shared/layouts/dash-nivel3/dash-nivel3.component';
import { ComponentCorreoComponent } from 'app/shared/layouts/dash-nivel3/component-correo/component-correo.component';
import { InvestigacionesComponent } from 'app/shared/layouts/dash-nivel2/investigaciones/investigaciones.component';
import { PrincipalComponent } from 'app/shared/layouts/principal/principal.component';
//auth modulo
import { InicioAppComponent } from "./modulos/auth/inicio-app/inicio-app.component";
import { LoginComponent } from './modulos/auth/login/login.component';
// nivel-1 modulo
import { TablaConsultasComponent } from "./modulos/nivel-1/tabla-consultas/tabla-consultas.component";

 const routes: Routes = [
  { path: 'inicio', component: InicioAppComponent},

  { path: 'principal', component: PrincipalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dash', component: DashboardInComponent,
   children : [
    { path: 'mapa', component: DashboardMapComponent},
    { path: 'consultas', component: TablaConsultasComponent},

    { path: 'dashnivel2', component: DashNivel2Component, canActivate: [UnivalleGuard],
    children: [
        {path: 'inscripciones', component: InscripcionesComponent},
        {path: 'renovaciones', component: RenovacionesComponent},
        {path: 'investigaciones', component: InvestigacionesComponent}
    ]},
    { path: 'dashnivel3', component: DashNivel3Component, canActivate: [Nivel3Guard],
    children: [
        { path: 'grafico1', component: Grafico1Component},
        { path: 'grafico2', component: Grafico2Component},
        { path: 'enviocorreos', component: ComponentCorreoComponent},
        { path: 'investigacion', component: ComponentInvestigacionComponent},
        { path: '', pathMatch: 'full', redirectTo: 'dash/mapa'}
    ]},

    { path: 'roles', component: RolesComponent, canActivate: [AdminGuard]},
    { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard]},
    { path: '', pathMatch: 'full', redirectTo: 'mapa'}
    ]},
    { path: '', pathMatch: 'full', redirectTo: 'inicio'},

];
export const app_routing = RouterModule.forRoot(routes, { useHash: true });

