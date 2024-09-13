import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OlvidePassPage } from './olvide-pass.page';

const routes: Routes = [
  {
    path: '',
    component: OlvidePassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OlvidePassPageRoutingModule {}
