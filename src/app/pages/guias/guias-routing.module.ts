import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuiasPage } from './guias.page';

const routes: Routes = [
  {
    path: '',
    component: GuiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuiasPageRoutingModule {}
