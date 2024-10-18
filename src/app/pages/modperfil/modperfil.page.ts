import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  
  currentUser: any;  // Almacena los datos actuales del usuario
  
  // Variables para las validaciones
  nombreVacio: boolean = false;
  nombreInvalido: boolean = false;
  nombreIgual: boolean = false;

  emailVacio: boolean = false;
  emailInvalido: boolean = false;

  passwordVacia: boolean = false;
  passwordIncorrecta: boolean = false;

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
    this.router.navigate(['/cambio-pass'], navigationExtras);
  }

  cargarDatosUsuario() {
    this.bd.getUsuarioById(this.id_usuario).then(usuario => {
      if (usuario) {
        this.currentUser = usuario;
        this.nombre_usuario = usuario.nombre_usuario;
        this.email = usuario.email;
      }
    }).catch(err => {
      console.error('Error al cargar datos del usuario:', err);
    });
  }

  validarNombreUsuario() {
    this.nombreVacio = this.nombre_usuario.trim() === '';
    this.nombreInvalido = this.nombre_usuario.length < 5 || this.nombre_usuario.length > 15;
    this.nombreIgual = this.nombre_usuario === this.currentUser.nombre_usuario;
  }

  validarEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailVacio = this.email.trim() === '';
    this.emailInvalido = !emailRegex.test(this.email);
  }

  validarPassword() {
    this.passwordVacia = this.password.trim() === '';
  }

  async guardarCambios() {
    this.validarNombreUsuario();
    this.validarEmail();
    this.validarPassword();

    if (this.nombreVacio || this.nombreInvalido || this.nombreIgual || this.emailVacio || this.emailInvalido || this.passwordVacia) {
      // Si hay algún error en las validaciones, no proceder
      return;
    }

    // Verificar que la contraseña sea correcta
    const usuarioActual = await this.bd.getUsuarioById(this.id_usuario);
    
    if (usuarioActual && usuarioActual.password === this.password) {
      this.passwordIncorrecta = false;
      // Contraseña correcta, proceder a actualizar nombre_usuario y/o email
      const cambios: any = {};

      if (this.nombre_usuario !== usuarioActual.nombre_usuario) {
        cambios.nombre_usuario = this.nombre_usuario;
      }
      if (this.email !== usuarioActual.email) {
        cambios.email = this.email;
      }

      if (Object.keys(cambios).length > 0) {
        this.bd.updateUsuario(this.id_usuario, cambios).then(() => {
          this.mostrarAlerta('Success', 'Profile updated successfully');
          this.router.navigate(['/perfil']);
        }).catch(err => {
          console.error('Error updating profile:', err);
          this.mostrarAlerta('Error', 'Unable to update profile');
        });
      } else {
        this.mostrarAlerta('No changes', 'No changes detected in your profile');
      }
    } else {
      this.passwordIncorrecta = true;
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
