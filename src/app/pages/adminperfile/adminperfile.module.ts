import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminperfilePageRoutingModule } from './adminperfile-routing.module';

import { AdminperfilePage } from './adminperfile.page';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminperfilePageRoutingModule,
    MatListModule, MatDividerModule,
    MatTabsModule
  ],
  declarations: [AdminperfilePage]
})
export class AdminperfilePageModule {}
