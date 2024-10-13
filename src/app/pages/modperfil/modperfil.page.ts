import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-modperfil',
  templateUrl: './modperfil.page.html',
  styleUrls: ['./modperfil.page.scss'],
})
export class ModperfilPage implements OnInit {
  id_usuario: any;
  nombre_usuario: string = '';
  email: string = '';
  password: string = '';


  constructor(private router: Router, private bd: SevicebdService, private alertCtrl: AlertController) {
    const navData = this.router.getCurrentNavigation()?.extras.state;
    if (navData && navData['userId']) {
      this.id_usuario = navData['userId']; 
      this.cargarDatosUsuario();  
    }
  }

  ngOnInit() {}

  cambiarpass() {
    const navigationExtras = {
      state: {
        userId: this.id_usuario  // Pasar el id_usuario al navegar
      }
    };
    this.router.navigate(['/cambiar-contrasena'], navigationExtras);
  }

  
  cargarDatosUsuario() {
    this.bd.getUsuarioById(this.id_usuario).then(usuario => {
      if (usuario) {
        this.nombre_usuario = usuario.nombre_usuario;
        this.email = usuario.email;
      }
    }).catch(err => {
      console.error('Error al cargar datos del usuario:', err);
    });
  }

  async guardarCambios() {
    // Verificar que la contraseña sea correcta
    const usuarioActual = await this.bd.getUsuarioById(this.id_usuario);
    
    if (usuarioActual && usuarioActual.password === this.password) {
      // Contraseña correcta, proceder a actualizar nombre_usuario y/o email
      const cambios: any = {};

      if (this.nombre_usuario && this.nombre_usuario !== usuarioActual.nombre_usuario) {
        cambios.nombre_usuario = this.nombre_usuario;
      }
      if (this.email && this.email !== usuarioActual.email) {
        cambios.email = this.email;
      }

      if (Object.keys(cambios).length > 0) {
        this.bd.updateUsuario(this.id_usuario, cambios).then(() => {
          this.mostrarAlerta('Éxito', 'Perfil actualizado correctamente');
        }).catch(err => {
          console.error('Error al actualizar perfil:', err);
          this.mostrarAlerta('Error', 'No se pudo actualizar el perfil');
        });
      } else {
        this.mostrarAlerta('Sin cambios', 'No hay cambios en los datos');
      }
    } else {
      // Contraseña incorrecta
      this.mostrarAlerta('Error', 'Password incorrect');
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
