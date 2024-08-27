import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObjetosPageRoutingModule } from './objetos-routing.module';

import { ObjetosPage } from './objetos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObjetosPageRoutingModule
  ],
  declarations: [ObjetosPage]
})
export class ObjetosPageModule {}
