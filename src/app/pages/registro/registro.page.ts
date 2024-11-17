import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Toast } from '@capacitor/toast';

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

  // Pregunta y respuesta de seguridad
securityQuestion: string = '';
securityAnswer: string = '';

// Control de errores
showSecurityQuestionError: boolean = false;
showSecurityAnswerError: boolean = false;


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
    return !this.showUsernameError && !this.usernameTooLong; // Retornar si es válido
  }

  validateEmail() {
    this.showEmailError = this.email.trim() === '' || !this.validarEmail(this.email) || this.email.length > 30;
    this.emailTooLong = this.email.length > 30;
    this.validEmail = this.validarEmail(this.email);
    return !this.showEmailError && this.validEmail && !this.emailTooLong; // Retornar si es válido
  }

  validatePassword() {
    this.showPasswordError = !this.validarPassword(this.password) || this.password.length > 15;
    this.passwordTooLong = this.password.length > 15;
    return !this.showPasswordError && !this.passwordTooLong; // Retornar si es válido
  }

  validatePasswordMatch() {
    this.showPasswordMatchError = this.password !== this.password2;
    return !this.showPasswordMatchError; // Retornar si las contraseñas coinciden
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validarPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  }

  validateSecurityQuestion() {
    this.showSecurityQuestionError = this.securityQuestion.trim() === '';
    return !this.showSecurityQuestionError; // Retorna si es válida
  }
  
  validateSecurityAnswer() {
    this.showSecurityAnswerError = this.securityAnswer.trim() === '';
    return !this.showSecurityAnswerError; // Retorna si es válida
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
    const isUsernameValid = this.validateUsername();
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    const isPasswordMatch = this.validatePasswordMatch();
    const isSecurityQuestionValid = this.validateSecurityQuestion();
    const isSecurityAnswerValid = this.validateSecurityAnswer();
  
    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isPasswordMatch || !isSecurityQuestionValid || !isSecurityAnswerValid) {
      await this.presentAlert('Error', 'Please fill all fields correctly before signing up.');
      return;
    }
  
    // Verificar si el usuario ya existe
    const result = await this.bd.checkUserExists(this.nombre_usuario, this.email);
    if (result.rows.length > 0) {
      await this.presentAlert('Error', 'User with this username or email already exists.');
      return;
    }
  
    // Registrar usuario con datos adicionales
    this.bd.registrarUsuario(
      this.nombre_usuario,
      this.email,
      this.password,
      2, // Rol de usuario estándar
      this.securityQuestion,
      this.securityAnswer
    );
    this.router.navigate(['/login']);
    await this.presentToast('Account created.');
  }

  async presentToast(message: string) {
    await Toast.show({
      text: message,
      duration: 'short', // 'short' o 'long'
      position: 'bottom', // 'top', 'center', 'bottom'
    });
  }
  
}
