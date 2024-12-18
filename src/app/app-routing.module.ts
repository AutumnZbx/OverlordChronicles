import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'cambio-pass',
    loadChildren: () => import('./pages/cambio-pass/cambio-pass.module').then( m => m.CambioPassPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'personajes',
    loadChildren: () => import('./pages/personajes/personajes.module').then( m => m.PersonajesPageModule)
  },
  {
    path: 'guias',
    loadChildren: () => import('./pages/guias/guias.module').then( m => m.GuiasPageModule)
  },
  {
    path: 'foro',
    loadChildren: () => import('./pages/foro/foro.module').then( m => m.ForoPageModule)
  },
  {
    path: 'crear-post',
    loadChildren: () => import('./pages/crear-post/crear-post.module').then( m => m.CrearPostPageModule)
  },
  {
    path: 'crear-guia',
    loadChildren: () => import('./pages/crear-guia/crear-guia.module').then( m => m.CrearGuiaPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'modperfil',
    loadChildren: () => import('./pages/modperfil/modperfil.module').then( m => m.ModperfilPageModule)
  },
  {
    path: 'modpersonajes',
    loadChildren: () => import('./pages/modpersonajes/modpersonajes.module').then( m => m.ModpersonajesPageModule)
  },
  {
    path: 'adminperfile',
    loadChildren: () => import('./pages/adminperfile/adminperfile.module').then( m => m.AdminperfilePageModule)
  },
  {
    path: 'detalle/:id',
    loadChildren: () => import('./pages/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'olvide-pass',
    loadChildren: () => import('./pages/olvide-pass/olvide-pass.module').then( m => m.OlvidePassPageModule)
  },
  {
    path: 'ejemplo-guias',
    loadChildren: () => import('./pages/ejemplo-guias/ejemplo-guias.module').then( m => m.EjemploGuiasPageModule)
  },
  {
    path: 'ejemplo-post',
    loadChildren: () => import('./pages/ejemplo-post/ejemplo-post.module').then( m => m.EjemploPostPageModule)
  },
  {
    path: 'editar-post',
    loadChildren: () => import('./pages/editar-post/editar-post.module').then( m => m.EditarPostPageModule)
  },
  {
    path: 'editar-guia',
    loadChildren: () => import('./pages/editar-guia/editar-guia.module').then( m => m.EditarGuiaPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
