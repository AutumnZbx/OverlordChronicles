import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}
  irPerfil(){
    this.router.navigate(['/perfil']);
  }

  irPersonajes(){
    this.router.navigate(['/personajes']);
  }

  irGuias(){
    this.router.navigate(['/guias']);
  }

  irForo(){
    this.router.navigate(['/foro']);
  }

}
