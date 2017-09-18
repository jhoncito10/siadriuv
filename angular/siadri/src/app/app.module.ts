import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layouts/header/header.component';
import { SidebarComponent } from './shared/layouts/sidebar/sidebar.component';
import { SidebarcomponentsComponent } from './shared/layouts/sidebarcomponents/sidebarcomponents.component';
import { ComponentComponent } from './shared/layouts/sidebarcomponents/agreements/component/component.component';
import { AgreementsComponent } from './shared/layouts/sidebarcomponents/agreements/agreements.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SidebarcomponentsComponent,
    ComponentComponent,
    AgreementsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
