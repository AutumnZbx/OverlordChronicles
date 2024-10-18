import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  // Control de errores y validación
  emailTouched: boolean = false;
  passwordTouched: boolean = false;
  showEmailError: boolean = false;
  showPasswordError: boolean = false;
  emailTooLong: boolean = false;
  passwordTooLong: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private bd: SevicebdService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
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
    this.showEmailError = this.email.trim() === '';
    this.emailTooLong = this.email.length > 30;
    this.cd.detectChanges();
  }

  validatePassword() {
    this.showPasswordError = this.password.trim() === '';
    this.passwordTooLong = this.password.length > 15;
    this.cd.detectChanges();
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  async handleLogin(event: Event) {
    event.preventDefault();

    // Validaciones
    this.validateEmail();
    this.validatePassword();

    if (this.showEmailError || this.emailTooLong || this.showPasswordError || this.passwordTooLong) {
      await this.presentAlert('Error', 'Please fill all fields correctly before logging in.');
      return;
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
        id_rol: usuarioLogueado.id_rol,
      };
      this.authService.setUser(user); // Use AuthService to store the user and update the menu
      this.router.navigate(['/home']);
    } else {
      this.presentAlert('Login Failed', 'Invalid email or password.');
    }
  }

  cambiar() {
    this.router.navigate(['/olvide-pass']);
  }

  registro() {
    this.router.navigate(['/registro']);
  }
}
