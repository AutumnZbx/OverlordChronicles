import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarPostPageRoutingModule } from './editar-post-routing.module';

import { EditarPostPage } from './editar-post.page';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPostPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditarPostPage]
})
export class EditarPostPageModule {}
