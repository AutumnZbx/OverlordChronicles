import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuiasPageRoutingModule } from './guias-routing.module';

import { GuiasPage } from './guias.page';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuiasPageRoutingModule,
    MatToolbarModule, MatButtonModule, MatIconModule
  ],
  declarations: [GuiasPage]
})
export class GuiasPageModule {}
