import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';


@NgModule({
    declarations : [PerfilUsuarioComponent],
    imports : [
        IonicModule,
        CommonModule],
    exports : 
    [
        PerfilUsuarioComponent
    ]
})

export class ComponentsModule{}