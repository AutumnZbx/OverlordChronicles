import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { Keyboard } from '@capacitor/keyboard';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-olvide-pass',
  templateUrl: './olvide-pass.page.html',
  styleUrls: ['./olvide-pass.page.scss'],
})
export class OlvidePassPage implements OnInit {

  currentStep: number = 1; // Controla el flujo
  email: string = '';
  securityQuestion: string = '';
  securityAnswer: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  correctAnswer: string = ''; // Respuesta correcta desde la base de datos
  
  // Flags y mensajes de validación
  showEmailError: boolean = false;
  showSecurityAnswerError: boolean = false;
  showPasswordError: boolean = false;
  showPasswordMatchError: boolean = false;
  emailErrorMessage: string = '';
  securityAnswerErrorMessage: string = '';
  passwordErrorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router:Router, private alertController: AlertController,private toastController: ToastController,private bd : SevicebdService) { }

  ngOnInit() {
     // Configurar Keyboard para mostrar un botón "Done" al abrir
  Keyboard.addListener('keyboardWillShow', () => {
    console.log('Keyboard is about to show');
  });

  Keyboard.addListener('keyboardDidHide', () => {
    console.log('Keyboard is hidden');
  });
  }


  // Validación de correo electrónico
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(this.email.trim());
    this.showEmailError = !isValidEmail || this.email.length > 50 || this.email.trim() === '';
    this.emailErrorMessage = 
      !isValidEmail ? 'Invalid email format.' :
      this.email.trim() === '' ? 'Email cannot be empty.' :
      this.email.length > 50 ? 'Email cannot exceed 50 characters.' : '';
  }

  async verifyEmail() {
    if (this.showEmailError) return;
  
    // Ocultar teclado antes de continuar
    Keyboard.hide();
  
    const result = await this.bd.getSecurityQuestionAndAnswer(this.email);
    if (result.rows.length > 0) {
      this.securityQuestion = result.rows.item(0).pregunta;
      this.correctAnswer = result.rows.item(0).respuesta;
      this.currentStep = 2; // Avanzar al siguiente paso
  
      // Mostrar notificación de éxito
      await this.presentToast('Email verified successfully.');
    } else {
      this.presentAlert('Error', 'No account found with this email.');
    }
  }

  // Validación de respuesta de seguridad
  validateSecurityAnswer() {
    this.showSecurityAnswerError =
      this.securityAnswer.trim() === '' || this.securityAnswer.length > 20 || this.securityAnswer !== this.correctAnswer;
    this.securityAnswerErrorMessage =
      this.securityAnswer.trim() === '' ? 'Answer cannot be empty.' :
      this.securityAnswer.length > 20 ? 'Answer cannot exceed 20 characters.' :
      this.securityAnswer !== this.correctAnswer ? 'Incorrect answer. Try again.' : '';
  }

  verifySecurityAnswer() {
    if (this.securityAnswer.trim() !== this.correctAnswer) {
      this.showSecurityAnswerError = true;
      this.securityAnswerErrorMessage = 'Incorrect answer. Try again.';
    } else {
      this.currentStep = 3; // Avanzar al paso final
    }
  }

  // Validaciones de contraseña
  
validatePassword() {
  const hasSpaces = /\s/.test(this.newPassword);
  this.showPasswordError =
    this.newPassword.trim() === '' || hasSpaces || this.newPassword.length > 15;
  this.passwordErrorMessage =
    this.newPassword.trim() === '' ? 'Password cannot be empty.' :
    hasSpaces ? 'Password cannot contain spaces.' :
    this.newPassword.length > 15 ? 'Password cannot exceed 15 characters.' : '';
}

validatePasswordMatch() {
  this.showPasswordMatchError = this.newPassword !== this.confirmPassword;
}

  // Restablecer contraseña
  async resetPassword() {
    if (this.showPasswordError || this.showPasswordMatchError) return;
  
    // Ocultar teclado antes de continuar
    Keyboard.hide();
  
    await this.bd.updatePassword(this.email, this.newPassword);
    this.presentAlert('Success', 'Your password has been updated.').then(async () => {
      await this.presentToast('Password reset successfully.');
      this.router.navigate(['/login']);
    });
  }
  
  async presentToast(message: string) {
    await Toast.show({
      text: message,
      duration: 'short', // 'short' o 'long'
      position: 'bottom', // 'top', 'center', 'bottom'
    });
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

