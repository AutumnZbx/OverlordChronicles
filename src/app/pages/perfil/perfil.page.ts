import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: string ="";

  constructor(private router: Router, private activedroute: ActivatedRoute) { 
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
