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

  login(){
    if (this.username === "") {
      this.presentToast('bottom', 'El campo "Nombre" no debe estar vacío.');
      return;
    }
    
    if (this.email === "") {
      this.presentToast('bottom', 'El campo "Correo electrónico" no debe estar vacío.');
      return;
    }
    if (!this.email.includes('@')) {
      this.presentToast('bottom', 'El correo electrónico no es valido.');
      return;
    }
    
    if (this.password === "") {
      this.presentToast('bottom', 'El campo "Contraseña" no debe estar vacío.');
      return;
    }
    
    if (this.password2 === "") {
      this.presentToast('bottom', 'El campo "Confirmar contraseña" no debe estar vacío.');
      return;
    }
    

    if (this.password !== this.password2) {
      this.presentToast('bottom', 'Las contraseñas no coinciden.');
      return;
    }
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    
    if (!passwordRegex.test(this.password)) {
      this.presentToast('bottom', 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.');
      return;
    }
  
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
