import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras,Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  username: string ="";
  email: string ="";
  password: string = '';
  showPassword: boolean = false;
  

  constructor(private router:Router, private alertController: AlertController, private toastController: ToastController,private activedroute: ActivatedRoute) { 
    this.activedroute.queryParams.subscribe(param =>{
      //validamos si recibe la informacion
      if(this.router.getCurrentNavigation()?.extras.state){
        //capturar la informacion
        this.password = this.router.getCurrentNavigation()?.extras?.state?.['password'];
        this.username = this.router.getCurrentNavigation()?.extras?.state?.['nombre'];
        this.email = this.router.getCurrentNavigation()?.extras?.state?.['correo'];
      }
    });
  }

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  validarCampos(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }


  login(){
    let navigationextras: NavigationExtras = {
      state:{
        nombre: this.username,
        correo: this.email,
        password: this.password
      }
    }
    this.presentToast('bottom', 'Inicio de sesion exitoso.');
    this.router.navigate(['/home'],navigationextras);
  }
  cambiar(){
    this.router.navigate(['/olvide-pass']);
  }
  registro(){
    this.router.navigate(['/registro']);
  }

}
