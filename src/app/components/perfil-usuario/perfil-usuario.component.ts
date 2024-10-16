import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})
export class PerfilUsuarioComponent implements OnInit {
  userName: string = '';
  constructor(private router: Router,private storage: NativeStorage,private modalController: ModalController) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    // Aquí puedes obtener los datos desde localStorage o un servicio
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = usuario.nombre_usuario ;
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
    this.cerrarModal(); // Llama al método para cerrar el modal
  }

  editarPerfil() {
    this.router.navigate(['/modperfil']);
    this.cerrarModal(); // Llama al método para cerrar el modal
  }

  cerrarModal() {
    this.modalController.dismiss(); // Cierra el modal
  }
}
