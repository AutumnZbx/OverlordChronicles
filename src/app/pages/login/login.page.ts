import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras,Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
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
  

  constructor(private router:Router, private alertController: AlertController, private toastController: ToastController,private activedroute: ActivatedRoute,private bd:SevicebdService, private storage: NativeStorage) { 
    
  }

  ngOnInit() {
    // Verificar si hay un usuario guardado en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Si ya está logueado, redirigir al home
      this.router.navigate(['/home']);
    } else {
      // Consultar por el estado de la base de datos
      this.bd.dbReady().subscribe(data => {
        if (data) {
          // Obtener los usuarios de la base de datos
          this.bd.fetchUsuario().subscribe(res => {
            this.arregloUsuario = res;
          });
        }
      });
    }
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
      position: 'bottom'
    });
    await toast.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  validarCampos(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }


  async login() {
    const result = await this.bd.checkUserCredentials(this.email, this.password);

    if (result.rows.length > 0) {
      // Usuario autenticado correctamente
      this.presentToast('Login Successful');

      // Obtener los datos del usuario desde la base de datos
      const usuarioLogueado = result.rows.item(0);

      // Guardar el usuario en localStorage para mantener la sesión
      const user = {
        id_usuario: usuarioLogueado.id_usuario,
        nombre_usuario: usuarioLogueado.nombre_usuario,
        email: usuarioLogueado.email,
        foto_perfil: usuarioLogueado.foto_perfil
      };
      localStorage.setItem('user', JSON.stringify(user));

      // Redireccionar al home o dashboard
      this.router.navigate(['/home']);
    } else {
      // Login fallido
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
