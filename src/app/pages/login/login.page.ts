import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  password: string = '';
  showPassword: boolean = false;

  constructor(private router:Router, private alertController: AlertController, private toastController: ToastController) { }

  ngOnInit() {
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Inicio de sesion exitoso!',
      duration: 2500,
      position: position,
    });

    await toast.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login(){
    this.presentToast('bottom');
    this.router.navigate(['/home']);
  }
  cambiar(){
    this.router.navigate(['/cambio-pass']);
  }
  registro(){
    this.router.navigate(['/registro']);
  }

}
