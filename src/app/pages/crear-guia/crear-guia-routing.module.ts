import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearGuiaPage } from './crear-guia.page';

const routes: Routes = [
  {
    path: '',
    component: CrearGuiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearGuiaPageRoutingModule {}
