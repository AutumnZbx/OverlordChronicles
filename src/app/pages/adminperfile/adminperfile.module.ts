import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminperfilePageRoutingModule } from './adminperfile-routing.module';

import { AdminperfilePage } from './adminperfile.page';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminperfilePageRoutingModule,
    MatTabsModule
  ],
  declarations: [AdminperfilePage]
})
export class AdminperfilePageModule {}
