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
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from 'app/shared/layouts/formularios-admin/usuarios/usuarios.component';
import { DashNivel3Component } from 'app/shared/layouts/dash-nivel3/dash-nivel3.component';
import { ComponentCorreoComponent } from 'app/shared/layouts/dash-nivel3/component-correo/component-correo.component';
import { InvestigacionesComponent } from 'app/shared/layouts/dash-nivel2/investigaciones/investigaciones.component';
//MODULO AUTH
import { InicioAppComponent } from './modulos/auth/inicio-app/inicio-app.component';
import { LoginComponent } from './modulos/auth/login/login.component';
// MODULO NIVEL 1
import { TablaConsultasComponent } from './modulos/nivel-1/tabla-consultas/tabla-consultas.component';

// MODULO NIVEL 2
//directores de programa
import { DirectoresProgramaUvComponent } from './modulos/nivel-2/directores-programa-uv/directores-programa-uv.component';
// pares externos
import { ParesExternosComponent } from './modulos/nivel-2/pares-externos/pares-externos.component';
// postulaciones Estudiantes
import { EstudiantesPostulacionesComponent } from './modulos/nivel-2/estudiantes-postulaciones/estudiantes-postulaciones.component';

//MODULO NIVEL 3
//  administracion de directores de programa
import { AdminDirectoresUvComponent } from './modulos/nivel-3/admin-directores-uv/admin-directores-uv.component';
import { AdminParesExternosComponent } from './modulos/nivel-3/admin-pares-externos/admin-pares-externos.component';
import { AdminPostEntrantesComponent } from './modulos/nivel-3/admin-post-entrantes/admin-post-entrantes.component';
import { AdminPostSalientesComponent } from './modulos/nivel-3/admin-post-salientes/admin-post-salientes.component';
import { AdminConveniosComponent } from './modulos/nivel-3/admin-convenios/admin-convenios.component';


const routes: Routes = [
    { path: 'inicio', component: InicioAppComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'dash', component: DashboardInComponent,
        children: [
            { path: 'consultas', component: TablaConsultasComponent },

            {
                path: 'dashnivel2', component: DashNivel2Component, canActivate: [UnivalleGuard],
                children: [
                    { path: 'inscripciones', component: InscripcionesComponent },
                    { path: 'renovaciones', component: RenovacionesComponent },
                    { path: 'investigaciones', component: InvestigacionesComponent },
                    { path: 'directores', component: DirectoresProgramaUvComponent },
                    { path: 'paresExternos', component: ParesExternosComponent },
                    { path: 'postulacionesEstudiantes', component: EstudiantesPostulacionesComponent }

                ]
            },
            {
                path: 'nivel2', component: DashNivel2Component,
                children: [
                    
                    { path: 'directores', component: DirectoresProgramaUvComponent },
                    { path: 'paresExternos', component: ParesExternosComponent },
                    { path: 'postulacionesEstudiantes', component: EstudiantesPostulacionesComponent }

                ]
            },
            {
                path: 'admin', component: DashNivel3Component, canActivate: [Nivel3Guard],
                children: [
                    { path: 'grafico1', component: Grafico1Component },
                    { path: 'grafico2', component: Grafico2Component },
                    { path: 'enviocorreos', component: ComponentCorreoComponent },
                    { path: 'investigacion', component: ComponentInvestigacionComponent },
                    { path: '', pathMatch: 'full', redirectTo: 'dash/consultas' },
                    { path: 'AdminDirectores', component: AdminDirectoresUvComponent },
                    { path: 'AdminParesExternos', component: AdminParesExternosComponent },
                    { path: 'AdminPostulacionesEntrantes', component: AdminPostEntrantesComponent },
                    { path: 'AdminPostulacionesSalientes', component: AdminPostSalientesComponent },
                    { path: 'AdminConvenios', component: AdminConveniosComponent }
                ]
            },

            { path: 'roles', component: RolesComponent, canActivate: [AdminGuard] },
            { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard] },
            { path: '', pathMatch: 'full', redirectTo: 'consultas' }
        ]
    },
    { path: '', pathMatch: 'full', redirectTo: 'inicio' },

];
export const app_routing = RouterModule.forRoot(routes, { useHash: true });

