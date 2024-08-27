import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuiasPageRoutingModule } from './guias-routing.module';

import { GuiasPage } from './guias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuiasPageRoutingModule
  ],
  declarations: [GuiasPage]
})
export class GuiasPageModule {}
