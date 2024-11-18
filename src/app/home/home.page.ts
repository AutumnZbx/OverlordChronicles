import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  unreadNotifications: boolean = false;

  constructor(private router: Router, 
              private activedroute: ActivatedRoute, 
              private bd: SevicebdService, 
              private storage: NativeStorage) { 

  }

  async ionViewWillEnter() {
    //this.bd.crearConexion();
    this.loadLatestContent();
    this.cargarDatosUsuario();
  }

  // Load the latest content (posts and guides)
  loadLatestContent() {
    this.bd.getVisiblePosts().then(result => {
      this.latestPosts = [];
      for (let i = 0; i < result.rows.length; i++) {
        this.latestPosts.push(result.rows.item(i));
      }
    });

    this.bd.getVisibleGuides().then(result => {
      this.latestGuides = [];
      for (let i = 0; i < result.rows.length; i++) {
        this.latestGuides.push(result.rows.item(i));
      }
    });
  }

  // Load user data from localStorage or the database
  cargarDatosUsuario() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.bd.dbReady().subscribe(data => {
        if (data) {
          // Get the user from the database
          this.bd.getUsuarioById(user.id_usuario).then(res => {
            this.usuario = res;
            // After fetching user data, check unread notifications
            this.checkUnreadNotifications();
          });
        }
      });
    } else {
      // If no user is found in localStorage, redirect to the login page
      this.router.navigate(['/login']);
    }
  }

  // Check for unread notifications for the user
  checkUnreadNotifications() {
    const userId = this.usuario.id_usuario;
  
    // Fetch unread notifications
    this.bd.getUnreadNotifications(userId).then((notifications) => {
      this.unreadNotifications = notifications.length > 0; // true if there are unread notifications
    });
  }


  // Navigate to the post details page
  goToPost(post: any) {
    const navigationExtras = {
      state: { postId: post.id_post } 
    };
    this.router.navigate(['/ejemplo-post'], navigationExtras);
  }

  // Navigate to the guide details page
  goToGuide(guias: any) {
    const navigationExtras = {
      state: { postId: guias.id_post } 
    };
    this.router.navigate(['/ejemplo-post'], navigationExtras); // Same route as goToPost
  }

  // Log out the user
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/inicio']);
  }
  irPerfil() {
    this.router.navigate(['/perfil']);
  }

  // Navigate to the notifications page
  goToNotifications() {
    this.router.navigate(['/notificaciones']);
  }
}
