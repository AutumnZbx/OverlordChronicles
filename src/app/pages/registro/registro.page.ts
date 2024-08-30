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

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Cuenta creada con exito',
      duration: 2500,
      position: position,
    });

    await toast.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login(){
    let navigationextras: NavigationExtras = {
      state:{
        nombre: this.username,
        correo: this.email,
        password: this.password
      }
    }
    this.presentToast('bottom');
    this.router.navigate(['/login'], navigationextras);
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se a Registrado correctamente',
      message: 'Loguear para entrar',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }



}
