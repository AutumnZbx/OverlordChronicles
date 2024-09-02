import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-guia',
  templateUrl: './crear-guia.page.html',
  styleUrls: ['./crear-guia.page.scss'],
})
export class CrearGuiaPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  crear(){
    this.router.navigate(['/guias']);
  }


}
