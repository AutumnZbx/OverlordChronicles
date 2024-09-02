import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-personajes',
  templateUrl: './personajes.page.html',
  styleUrls: ['./personajes.page.scss'],
})
export class PersonajesPage implements OnInit {
  

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
  
    detalle(){
      this.router.navigate(['/detalle']);
    }

}


