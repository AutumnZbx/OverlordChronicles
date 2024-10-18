import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre_usuario: string = '';
  email: string = '';
  password: string = '';
  password2: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Control de errores
  showUsernameError: boolean = false;
  showEmailError: boolean = false;
  showPasswordError: boolean = false;
  showPasswordMatchError: boolean = false;

  // Flags de longitud y formato
  usernameTooLong: boolean = false;
  emailTooLong: boolean = false;
  passwordTooLong: boolean = false;
  validPassword: boolean = false;
  validEmail: boolean = false;
  passwordsMatch: boolean = true;

  constructor(
    private router: Router,
    public alertController: AlertController,
    private bd: SevicebdService
  ) {}

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  validateUsername() {
    this.showUsernameError = this.nombre_usuario.trim() === '' || this.nombre_usuario.length > 15;
    this.usernameTooLong = this.nombre_usuario.length > 15;
  }

  validateEmail() {
    this.showEmailError = this.email.trim() === '' || !this.validarEmail(this.email) || this.email.length > 30;
    this.emailTooLong = this.email.length > 30;
    this.validEmail = this.validarEmail(this.email);
  }

  validatePassword() {
    this.showPasswordError = !this.validarPassword(this.password) || this.password.length > 15;
    this.passwordTooLong = this.password.length > 15;
  }

  validatePasswordMatch() {
    this.showPasswordMatchError = this.password !== this.password2;
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validarPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async register(event: Event) {
    event.preventDefault();

    // Validaciones
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validatePasswordMatch();

    if (
      this.showUsernameError ||
      this.usernameTooLong ||
      this.showEmailError ||
      this.emailTooLong ||
      !this.validEmail ||
      this.passwordTooLong ||
      !this.validPassword ||
      this.showPasswordMatchError
    ) {
      await this.presentAlert('Error', 'Please fill all fields correctly before signing up.');
      return;
    }

    const result = await this.bd.checkUserExists(this.nombre_usuario, this.email);
    if (result.rows.length > 0) {
      this.presentAlert('Error', 'User with this username or email already exists.');
      return;
    }

    this.bd.registrarUsuario(this.nombre_usuario, this.email, this.password, 2);
    this.router.navigate(['/login']);
  }
}
