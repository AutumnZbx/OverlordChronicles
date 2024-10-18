import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarPostPage } from './editar-post.page';

const routes: Routes = [
  {
    path: '',
    component: EditarPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPostPageRoutingModule {}
