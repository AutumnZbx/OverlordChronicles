import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioPassPage } from './cambio-pass.page';

const routes: Routes = [
  {
    path: '',
    component: CambioPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambioPassPageRoutingModule {}
