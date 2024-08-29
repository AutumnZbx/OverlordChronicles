import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router,ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: string ="";

  constructor(private alertController: AlertController,private router: Router, private activedroute: ActivatedRoute) { 
  this.activedroute.queryParams.subscribe(param =>{
    //verificar si viene la variable de contexto
    if(this.router.getCurrentNavigation()?.extras.state){
      //recepcionar y guardar los datos
      this.usuario = this.router.getCurrentNavigation()?.extras?.state?.['nombre'];
    }
  });
 }
  ngOnInit() {
  }

  changeProfileImage() {
    // Aquí iría la lógica para cambiar la imagen de perfil
    console.log('Cambiar imagen de perfil');
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que quieres cerrar la sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  logout() {
    // Aquí iría la lógica para cerrar la sesión
    console.log('Cerrar sesión');
  }

  irPerfil(){
    let navigationextras: NavigationExtras = {
      state:{
        nombre: this.usuario,
      }
    }
    this.router.navigate(['/perfil'],navigationextras);
  }

  irPersonajes(){
    let navigationextras: NavigationExtras = {
      state:{
        nombre: this.usuario,
      }
    }
    this.router.navigate(['/personajes'],navigationextras);
  }

  irGuias(){
    let navigationextras: NavigationExtras = {
      state:{
        nombre: this.usuario,
      }
    }
    this.router.navigate(['/guias'],navigationextras);
  }

  irForo(){
    let navigationextras: NavigationExtras = {
      state:{
        nombre: this.usuario,
      }
    }
    this.router.navigate(['/foro'],navigationextras);
  }
  irHome(){
    let navigationextras: NavigationExtras = {
      state:{
        nombre: this.usuario,
      }
    }
    this.router.navigate(['/home'],navigationextras);
  }

}
