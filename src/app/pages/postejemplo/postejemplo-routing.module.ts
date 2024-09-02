import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostejemploPage } from './postejemplo.page';

const routes: Routes = [
  {
    path: '',
    component: PostejemploPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostejemploPageRoutingModule {}
