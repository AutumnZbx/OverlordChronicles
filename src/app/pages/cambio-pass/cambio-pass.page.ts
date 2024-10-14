import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

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

  constructor(private router: Router,private activedrouter: ActivatedRoute,private bd: SevicebdService,private alertController: AlertController, private storage: NativeStorage) {
    this.cargarDatosUsuario();
    // Obtener el ID del usuario desde la navegación
    this.activedrouter.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['userId']) {
        this.id_usuario = this.router.getCurrentNavigation()?.extras?.state?.['userId'];
      }
    });
  }

  ngOnInit() {
  }
  cargarDatosUsuario() {
    // Verificar si hay un usuario guardado en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Parsear el usuario guardado
      const user = JSON.parse(storedUser);
      // Consultar por el estado de la base de datos
      this.bd.dbReady().subscribe(data => {
        if (data) {
          // Obtener los datos del usuario de la base de datos
          this.bd.getUsuarioById(user.id_usuario).then(res => {
            this.usuario = res;
          });
        }
      });
    } else {
      // Si no hay usuario guardado, redirigir al login o manejar el error
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

  // Toggle visibility of the confirm password input
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /// Show alert
  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Method to change the password
  changePassword() {
    // Validation for the password rules
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    if (!passwordRegex.test(this.newPassword)) {
      this.showAlert('Error', 'The password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.');
      return;
    }

    // Validate that the new password is different from the current one
    if (this.newPassword === this.usuario.password) {
      this.showAlert('Error', 'The new password cannot be the same as the current password.');
      return;
    }

    // Validate that the new password and confirm password match
    if (this.newPassword !== this.confirmPassword) {
      this.showAlert('Error', 'The passwords do not match.');
      return;
    }

    // Call the service to update the password
    this.bd.updatePassword(this.id_usuario, this.newPassword)
      .then(() => {
        this.showAlert('Success', 'Password changed successfully.');
        this.logout();
      })
      .catch(err => {
        console.error('Error changing password:', err);
        this.showAlert('Error', 'Could not change the password.');
      });
  }

  // Método para cerrar la sesión y redirigir a la página de login
  logout() {
    // Aquí puedes limpiar la sesión (localStorage, etc.)
    localStorage.removeItem('user');  // Ejemplo: Eliminar la sesión del usuario
    this.router.navigate(['/login'], { replaceUrl: true });  // Redirigir a la pantalla de login
  }
}


