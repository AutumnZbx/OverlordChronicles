import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.page.html',
  styleUrls: ['./guias.page.scss'],
})
export class GuiasPage implements OnInit {

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
    crear(){
      this.router.navigate(['/crear-guia']);
    }
  
    

}


