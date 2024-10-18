import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ApiService } from 'src/app/services/api.service';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-personajes',
  templateUrl: './personajes.page.html',
  styleUrls: ['./personajes.page.scss'],
})
export class PersonajesPage implements OnInit {
  
  usuario: any = {}; 
  
  characterList: any[] = [];  // Lista de personajes
  constructor(private api : ApiService, private router: Router, private bd:SevicebdService, private storage: NativeStorage) { 
   }
    ngOnInit() {
      this.loadCharacters();
      this.cargarDatosUsuario();
    }
    
    ionViewWillEnter() {
      this.loadCharacters();
      this.cargarDatosUsuario();
    }
    cargarDatosUsuario() {
      // Verificar si hay un usuario guardado en localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // Parsear el usuario guardado
        const user = JSON.parse(storedUser);
        // Consultar por el estado de la base de datos
        this.bd.dbReady().subscribe(data => {
          if (data) {
            // Obtener los datos del usuario de la base de datos
            this.bd.getUsuarioById(user.id_usuario).then(res => {
              this.usuario = res;
            });
          }
        });
      } else {
        // Si no hay usuario guardado, redirigir al login o manejar el error
        this.router.navigate(['/login']);
      }
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

