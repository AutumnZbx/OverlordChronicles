import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModpersonajesPage } from './modpersonajes.page';

const routes: Routes = [
  {
    path: '',
    component: ModpersonajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModpersonajesPageRoutingModule {}
