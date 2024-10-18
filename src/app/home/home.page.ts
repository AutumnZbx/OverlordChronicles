import { Component } from '@angular/core';
import { NavigationExtras,Router,ActivatedRoute } from '@angular/router';
import { SevicebdService } from '../services/sevicebd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  latestPosts: any[] = [];
  latestGuides: any[] = [];


  usuario: any = {}; 


  constructor(private router: Router, private activedroute: ActivatedRoute, private bd:SevicebdService, private storage: NativeStorage) { 
    this.loadLatestContent();
    this.cargarDatosUsuario();
   }

   ionViewWillEnter() {
    this.loadLatestContent();
    this.cargarDatosUsuario();
  }

   loadLatestContent() {
    this.bd.getLatestPosts().then(result => {
      this.latestPosts = [];
      for (let i = 0; i < result.rows.length; i++) {
        this.latestPosts.push(result.rows.item(i));
      }
    });

    this.bd.getLatestGuides().then(result => {
      this.latestGuides = [];
      for (let i = 0; i < result.rows.length; i++) {
        this.latestGuides.push(result.rows.item(i));
      }

      
    });

    
  }

  // Cargar datos del usuario desde la base de datos o el almacenamiento
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

  goToPost(post: any) {
    const navigationExtras = {
      state: {
        postId: post.id_post // Solo enviamos el id_post
      }
    };
    this.router.navigate(['/ejemplo-post'], navigationExtras);
  }

  goToGuide(guias: any) {
    const navigationExtras = {
      state: {
        guiaId: guias.id_guia 
      }
    };
    this.router.navigate(['/ejemplo-guias'], navigationExtras);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/inicio']);
  }
 
  
   

  


}
