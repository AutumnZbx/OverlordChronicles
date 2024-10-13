import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjemploPostPageRoutingModule } from './ejemplo-post-routing.module';

import { EjemploPostPage } from './ejemplo-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploPostPageRoutingModule
  ],
  declarations: [EjemploPostPage]
})
export class EjemploPostPageModule {}
