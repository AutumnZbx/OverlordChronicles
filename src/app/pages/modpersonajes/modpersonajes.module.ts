import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModpersonajesPageRoutingModule } from './modpersonajes-routing.module';

import { ModpersonajesPage } from './modpersonajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModpersonajesPageRoutingModule
  ],
  declarations: [ModpersonajesPage]
})
export class ModpersonajesPageModule {}
