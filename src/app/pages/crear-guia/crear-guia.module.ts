import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearGuiaPageRoutingModule } from './crear-guia-routing.module';

import { CrearGuiaPage } from './crear-guia.page';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearGuiaPageRoutingModule,
    FormsModule, MatFormFieldModule, MatInputModule
  ],
  declarations: [CrearGuiaPage]
})
export class CrearGuiaPageModule {}
