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

  async presentToast(position: 'middle', texto:string) {
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
      message: 'Loguear para entrar',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login(){
    if (this.username===""){

      this.presentToast('middle','El campo "Nombre" está vacío.');
      return;
    }if (this.email===""){

      this.presentToast('middle','El campo "Correo electrónico" está vacío.');
      return;
    }if (this.password===""){

      this.presentToast('middle','El campo "Contraseña" está vacío.');
      return;
    }if (this.password2===""){

      this.presentToast('middle','El campo "Confirmar contraseña" está vacío.');
      return;
    }if (this.password!=this.password2){

      this.presentToast('middle','Las contraseñas no coinciden.');
      return;
    }else{
    let navigationextras: NavigationExtras = {
      state:{
        nombre: this.username,
        correo: this.email,
        password: this.password
      }
    }
    this.presentAlert;
    this.router.navigate(['/login'], navigationextras);
  }
}}
