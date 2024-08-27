import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearPostPageRoutingModule } from './crear-post-routing.module';

import { CrearPostPage } from './crear-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearPostPageRoutingModule
  ],
  declarations: [CrearPostPage]
})
export class CrearPostPageModule {}
