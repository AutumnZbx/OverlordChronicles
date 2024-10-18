import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Clipboard } from '@capacitor/clipboard';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  character: any = null;

  constructor(private route: ActivatedRoute, private api: ApiService,private clipboard: Clipboard) { }

  ngOnInit() {
    // Obtener el ID del personaje desde la URL
    const characterId = this.route.snapshot.paramMap.get('id');
    this.loadCharacterDetails(characterId);
  }

  // Cargar los detalles del personaje por ID
  loadCharacterDetails(id: string | null) {
    if (id) {
      this.api.getCharacterById(id).subscribe((res) => {
        console.log(res);  // Para asegurarte de que los datos están llegando correctamente
        if (res.ok) {
          this.character = res.personaje;  // Cambiar 'res.personajeFound' a 'res.personaje'
        } else {
          console.log('Character not found');
        }
      }, (error) => {
        console.log('Error fetching character details', error);
      });
    }
  }

  async copiarTexto() {
    if (this.character && this.character.desc) {
      try {
        await Clipboard.write({
          string: this.character.desc
        }); 
      } catch (error) {
        console.error('Error :', error);
      }
    }
  }
  
}