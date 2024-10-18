import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarGuiaPage } from './editar-guia.page';

const routes: Routes = [
  {
    path: '',
    component: EditarGuiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarGuiaPageRoutingModule {}
