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
  emailTouched: boolean = false;
  passwordTouched: boolean = false;
  showEmailError: boolean = false;
  showPasswordError: boolean = false;
  emailInvalid: boolean = false;
  emailTooLong: boolean = false;
  passwordTooLong: boolean = false;
  passwordTooShort: boolean = false;
  showPassword: boolean = false;

  
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
    if (!this.email) {
      this.showEmailError = true;
    } else if (this.email.length > 30) {
      this.emailTooLong = true;
    } else {
      this.showEmailError = false;
      this.emailTooLong = false;
    }
  }
  
  // Password validation
  validatePassword() {
    if (!this.password) {
      this.showPasswordError = true;
    } else if (this.password.length > 15) {
      this.passwordTooLong = true;
    } else {
      this.showPasswordError = false;
      this.passwordTooLong = false;
    }
  }

  isFormValid(): boolean {
    return !this.showEmailError && !this.emailTooLong && !this.showPasswordError && !this.passwordTooLong && !this.passwordTooShort;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500
    });
    await toast.present();
  }

  async handleLogin(event: Event) {
    event.preventDefault();
  
    // Trigger validation checks when submitting
    this.validateEmail();
    this.validatePassword();
  
    // Show an alert if any field has an error
    if (this.showEmailError || this.emailTooLong || this.showPasswordError || this.passwordTooLong || !this.email || !this.password) {
      await this.presentAlert('Error', 'Please fill all fields correctly before logging in.');
      return;
    }
  
    // Call to database to check credentials
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
      this.authService.setUser(user); // Store user data
      this.router.navigate(['/home']); // Redirect to home page
    } else {
      await this.presentAlert('Login Failed', 'Invalid email or password.');
    }
  }

  cambiar() {
    this.router.navigate(['/olvide-pass']);
  }

  registro() {
    this.router.navigate(['/registro']);
  }
}
