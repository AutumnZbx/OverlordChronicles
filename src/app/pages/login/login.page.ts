import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";
  showPassword: boolean = false;

  // Control de errores y validación
  emailTouched: boolean = false;
  passwordTouched: boolean = false;
  showEmailError: boolean = false;
  showPasswordError: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private bd: SevicebdService,
    private storage: NativeStorage,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.router.navigate(['/home']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateEmail() {
    this.showEmailError = this.email.trim() === "";
  }

  validatePassword() {
    this.showPasswordError = this.password.trim() === "";
  }

  async handleLogin() {
    this.validateEmail();
    this.validatePassword();
  
    if (this.showEmailError || this.showPasswordError) {
      return; // Stop login if there are errors
    }
  
    const result = await this.bd.checkUserCredentials(this.email, this.password);
    if (result.rows.length > 0) {
      this.presentToast('Login Successful');
      const usuarioLogueado = result.rows.item(0);
      const user = {
        id_usuario: usuarioLogueado.id_usuario,
        nombre_usuario: usuarioLogueado.nombre_usuario,
        email: usuarioLogueado.email,
        foto_perfil: usuarioLogueado.foto_perfil,
        id_rol: usuarioLogueado.id_rol
      };
      this.authService.setUser(user); // Use AuthService to store the user and update the menu
      this.router.navigate(['/home']);
    } else {
      this.presentAlert('Invalid username/email or password.');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom'
    });
    await toast.present();
  }

  cambiar() {
    this.router.navigate(['/olvide-pass']);
  }

  registro() {
    this.router.navigate(['/registro']);
  }
}
