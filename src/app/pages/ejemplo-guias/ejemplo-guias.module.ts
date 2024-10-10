import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjemploGuiasPageRoutingModule } from './ejemplo-guias-routing.module';

import { EjemploGuiasPage } from './ejemplo-guias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploGuiasPageRoutingModule
  ],
  declarations: [EjemploGuiasPage]
})
export class EjemploGuiasPageModule {}
