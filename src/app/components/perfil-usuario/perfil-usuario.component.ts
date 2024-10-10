import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})
export class PerfilUsuarioComponent  implements OnInit {
  userName = 'John Doe';
  userBio = 'Gamer and guide creator';

  constructor(private router: Router, private activedroute: ActivatedRoute) { }

  ngOnInit() {}

  editarPerfil() {
    this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    // Lógica para cerrar sesión
    console.log("Sesión cerrada");
    this.router.navigate(['/inicio']);
  }

}
