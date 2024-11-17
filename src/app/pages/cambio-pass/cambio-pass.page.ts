import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-cambio-pass',
  templateUrl: './cambio-pass.page.html',
  styleUrls: ['./cambio-pass.page.scss'],
})
export class CambioPassPage implements OnInit {

  id_usuario: any;
  usuario: any = {};
  newPassword: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Variables para validaciones
  newPasswordVacia: boolean = false;
  confirmPasswordVacia: boolean = false;
  passwordLarga: boolean = false;
  passwordsNoCoinciden: boolean = false;

  constructor(
    private router: Router,
    private activedrouter: ActivatedRoute,
    private bd: SevicebdService,
    private alertController: AlertController
  ) {
    this.cargarDatosUsuario();
    this.activedrouter.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['userId']) {
        this.id_usuario = this.router.getCurrentNavigation()?.extras?.state?.['userId'];
      }
    });
  }

  ngOnInit() {}

  cargarDatosUsuario() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.bd.dbReady().subscribe(data => {
        if (data) {
          this.bd.getUsuarioById(user.id_usuario).then(res => {
            this.usuario = res;
          });
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Mostrar alerta
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validarPasswords() {
    // Validación de si los campos están vacíos
    this.newPasswordVacia = this.newPassword.trim() === '';
    this.confirmPasswordVacia = this.confirmPassword.trim() === '';
    
    // Validación de que las contraseñas no excedan los 15 caracteres
    this.passwordLarga = this.newPassword.length > 15 || this.confirmPassword.length > 15;

    // Validación de que ambas contraseñas coincidan
    this.passwordsNoCoinciden = this.newPassword !== this.confirmPassword;
  }

  changePassword() {
    this.validarPasswords();

    if (this.newPasswordVacia || this.confirmPasswordVacia || this.passwordLarga || this.passwordsNoCoinciden) {
      // Si hay errores en las validaciones, no continuar
      return;
    }

    // Validar que la nueva contraseña sea diferente de la actual
    if (this.newPassword === this.usuario.password) {
      this.mostrarAlerta('Error', 'The new password cannot be the same as the current password.');
      return;
    }

    // Actualizar la contraseña
    this.bd.updatePassword(this.id_usuario, this.newPassword)
      .then(() => {
         this.presentToast('Password changed.');
        this.logout();
      })
      .catch(err => {
        console.error('Error changing password:', err);
        this.mostrarAlerta('Error', 'Could not change the password.');
      });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  async presentToast(message: string) {
    await Toast.show({
      text: message,
      duration: 'short', // 'short' o 'long'
      position: 'bottom', // 'top', 'center', 'bottom'
    });
  }
}
