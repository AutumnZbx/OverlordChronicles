import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modperfil',
  templateUrl: './modperfil.page.html',
  styleUrls: ['./modperfil.page.scss'],
})
export class ModperfilPage implements OnInit {
  username: string ="";
  email: string="";
  password: string = '';
  password2: string = '';
  showPassword: boolean = false;


  constructor(private router:Router, private toastController: ToastController) { }

  ngOnInit() {
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Cambios guardados',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  guardar(){
    this.router.navigate(['/perfil']);
  }

}
