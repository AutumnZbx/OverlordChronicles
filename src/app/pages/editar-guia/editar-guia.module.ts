import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarGuiaPageRoutingModule } from './editar-guia-routing.module';

import { EditarGuiaPage } from './editar-guia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarGuiaPageRoutingModule
  ],
  declarations: [EditarGuiaPage]
})
export class EditarGuiaPageModule {}
