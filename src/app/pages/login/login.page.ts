import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras,Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  arregloUsuario: any = [
    {
      id_usuario: '',
      nombre_usuario: '',
      email: '',
      password:'',
      foto_perfil:'',
    }
  ]


  nombre_usuario: string ="";
  email: string ="";
  password: string = "";
  showPassword: boolean = false;
  

  constructor(private router:Router, private alertController: AlertController, private toastController: ToastController,private activedroute: ActivatedRoute,private bd:SevicebdService) { 
    
  }

  ngOnInit() {
    //consulto por el estado de la base de datos
    this.bd.dbReady().subscribe(data=>{
      //verifico si esta disponible
      if(data){
        //me subcribo al observable del select de todas las noticias
        this.bd.fetchUsuario().subscribe(res=>{
          //guardar ese resultado en mi variable propia
          this.arregloUsuario = res;
        })
      }
    })
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

   async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'middle'
    });
    await toast.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  validarCampos(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }


  async login(){
    const result = await this.bd.checkUserCredentials(this.email, this.password);
    
    if (result.rows.length > 0) {
      // Successful login
      this.presentToast('Login Successful');
      
      // Navigate to home or dashboard after successful login
      this.router.navigate(['/home']);
    } else {
      // Failed login
      this.presentAlert('Invalid email or password.');
    }

  }
  cambiar(){
    this.router.navigate(['/olvide-pass']);
  }
  registro(){
    this.router.navigate(['/registro']);
  }

}
