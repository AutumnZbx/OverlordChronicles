import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploPostPage } from './ejemplo-post.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploPostPageRoutingModule {}
