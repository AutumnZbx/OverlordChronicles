import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploGuiasPage } from './ejemplo-guias.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploGuiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploGuiasPageRoutingModule {}
