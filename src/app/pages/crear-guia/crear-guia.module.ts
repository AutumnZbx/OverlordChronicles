import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearGuiaPageRoutingModule } from './crear-guia-routing.module';

import { CrearGuiaPage } from './crear-guia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearGuiaPageRoutingModule
  ],
  declarations: [CrearGuiaPage]
})
export class CrearGuiaPageModule {}
