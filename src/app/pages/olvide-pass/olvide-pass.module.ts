import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlvidePassPageRoutingModule } from './olvide-pass-routing.module';

import { OlvidePassPage } from './olvide-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OlvidePassPageRoutingModule
  ],
  declarations: [OlvidePassPage]
})
export class OlvidePassPageModule {}
