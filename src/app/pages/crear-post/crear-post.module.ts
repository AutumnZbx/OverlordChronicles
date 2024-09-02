import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearPostPageRoutingModule } from './crear-post-routing.module';

import { CrearPostPage } from './crear-post.page';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearPostPageRoutingModule,
    FormsModule, MatFormFieldModule, MatInputModule
  ],
  declarations: [CrearPostPage]
})
export class CrearPostPageModule {}
