import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostejemploPageRoutingModule } from './postejemplo-routing.module';

import { PostejemploPage } from './postejemplo.page';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostejemploPageRoutingModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule
  ],
  declarations: [PostejemploPage]
})
export class PostejemploPageModule {}
