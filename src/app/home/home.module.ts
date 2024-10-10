import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TabComponent } from '../components/tab/tab.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PerfilUsuarioComponent } from '../components/perfil-usuario/perfil-usuario.component';
import { NotificacionesComponent } from '../components/notificaciones/notificaciones.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MatToolbarModule, MatButtonModule, MatIconModule
  ],
  declarations: [HomePage,TabComponent,PerfilUsuarioComponent,NotificacionesComponent]
})
export class HomePageModule {}
