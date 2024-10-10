import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre_usuario: string ="";
  email: string="";
  password: string = "";
  password2: string = "";
  showPassword: boolean = false;
  id_rol: number= 2;
  constructor(private router:Router, public alertController: AlertController, private toastController: ToastController, private bd:SevicebdService) { }

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


  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
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
    return this.nombre_usuario.trim() !== '' && this.email.trim() !== '';
  }

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  }


  async login(){
    // Si todo está bien, navega al login y muestra la alerta
    const result = await this.bd.checkUserExists(this.nombre_usuario, this.email);
    if (result.rows.length > 0) {
      this.presentAlert('Error','User with this username or email already exists.');
      return;
    }
    this.bd.registrarUsuario(this.nombre_usuario,this.email,this.password,this.id_rol)
    this.router.navigate(['/login'], );
  }
}
