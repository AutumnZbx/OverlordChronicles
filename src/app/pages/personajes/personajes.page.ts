import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-personajes',
  templateUrl: './personajes.page.html',
  styleUrls: ['./personajes.page.scss'],
})
export class PersonajesPage implements OnInit {
  

  
  characterList: any[] = [];  // Lista de personajes
  constructor(private api : ApiService, private router: Router) { 
   }
    ngOnInit() {
      this.loadCharacters();
    }

    loadCharacters() {
      this.api.getAllCharacters().subscribe((res) => {
        if (res.ok) {
          this.characterList = res.personajes;
        }
      }, (error) => {
        console.log('Error loading characters', error);
      });
    }
  
    // Navegar a la página de detalles
    goToDetails(id: any) {
      this.router.navigate(['/detalle', id]);
    }
  }

