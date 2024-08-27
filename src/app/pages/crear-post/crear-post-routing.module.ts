import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearPostPage } from './crear-post.page';

const routes: Routes = [
  {
    path: '',
    component: CrearPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearPostPageRoutingModule {}
