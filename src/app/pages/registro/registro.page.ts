import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  username: string ="";
  email: string="";
  password: string = '';
  password2: string = '';
  showPassword: boolean = false;

  constructor(private router:Router, public alertController: AlertController, private toastController: ToastController) { }

  ngOnInit() {
  }

  async presentToast(position: 'bottom', texto:string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se a Registrado correctamente',
      message: 'Inicie sesion para entrar',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  validarCampos(): boolean {
    return this.username.trim() !== '' && this.email.trim() !== '';
  }

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  }


  login(){
    // Si todo está bien, navega al login y muestra la alerta
    let navigationExtras: NavigationExtras = {
      state: {
        nombre: this.username,
        correo: this.email,
        password: this.password
      }
    };
    
    this.presentAlert();
    this.router.navigate(['/login'], navigationExtras);
  }
}
