import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})
export class PerfilUsuarioComponent implements OnInit {
  userName: string = '';
  usuario: any={};
  constructor(private router: Router,private storage: NativeStorage,private popoverController: PopoverController) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  async ionViewWillEnter() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    // Aquí puedes obtener los datos desde localStorage o un servicio
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = usuario.nombre_usuario ;
    this.usuario = usuario
  }

  async irPerfil() {
    await this.router.navigate(['/perfil']);
  }

  
}
