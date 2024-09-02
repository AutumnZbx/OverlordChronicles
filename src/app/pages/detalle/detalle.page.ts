import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  volver(){
    this.router.navigate(['/personajes']);
  }

}
