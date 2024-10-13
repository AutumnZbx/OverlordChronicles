import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-ejemplo-guias',
  templateUrl: './ejemplo-guias.page.html',
  styleUrls: ['./ejemplo-guias.page.scss'],
})
export class EjemploGuiasPage implements OnInit {

  guias : any;

  constructor(private router: Router, private activedrouter:ActivatedRoute, private bd: SevicebdService) { }

  ngOnInit() {
    // Verificar si el postId fue pasado en el estado de navegación
    if (this.router.getCurrentNavigation()?.extras?.state?.['guiaId']) {
      const guiaId = this.router.getCurrentNavigation()?.extras?.state?.['guiaId'];
      this.cargarPost(guiaId); // Cargar el post con el id
    } else {
      // Si no se recibió el id, mostramos un mensaje de error
      this.guias = {
        id_guia: 0,
        titulo: 'Guia no encontrado',
        contenido: 'No hay contenido disponible para esta guia.',
        imagen: null
      };
    }
  }

  async cargarPost(id_guia: number) {
    try {
      // Llamamos a la función del servicio para obtener el post por su id
      const guiaCargada = await this.bd.getGuideById(id_guia);
      if (guiaCargada) {
        this.guias = guiaCargada; // Guardamos el post en la variable
      } else {
        this.guias = {
          id_guia: 0,
          titulo: 'Guia no encontrado',
          contenido: 'Esta guia no existe o ha sido eliminado.',
          imagen: null
        };
      }
    } catch (error) {
      console.error('Error al cargar la guia: ', error);
      this.guias = {
        id_guia: 0,
        titulo: 'Error',
        contenido: 'Hubo un error al intentar cargar la guia.',
        imagen: null
      };
    }
  }

}
