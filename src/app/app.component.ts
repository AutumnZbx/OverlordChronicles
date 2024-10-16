import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  VerMenu = true;
  esAdmin = false;

  constructor(private router: Router,private menuCtrl: MenuController, private alertController: AlertController,private storage: NativeStorage,private modalController: ModalController,private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateMenuVisibility(event.url);
      }
    });

    // Subscribe to user changes
    this.authService.getUserObservable().subscribe((user) => {
      this.esAdmin = user && user.id_rol === 1; // Check if the logged-in user is admin
    });
  }

  // Función para ocultar el menú en ciertas rutas y desactivar el swipe
  updateMenuVisibility(url: string) {
    const hiddenRoutes = ['/login', '/registro', '/olvide-pass', '/inicio'];
    this.VerMenu = !hiddenRoutes.includes(url);
    if (hiddenRoutes.includes(url)) {
      this.menuCtrl.swipeGesture(false);  // Desactiva swipe
    } else {
      this.menuCtrl.swipeGesture(true);   // Activa swipe en otras páginas
    }
  }

  /// Method to handle access to admin page
  async goToAdminPage() {
    if (this.esAdmin) {
      this.router.navigate(['/adminperfile']);
    } else {
      const alert = await this.alertController.create({
        header: 'Access Denied',
        message: 'You must be an admin to access this section.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }


  cerrarSesion() {
    localStorage.removeItem('user');
    this.router.navigate(['/inicio']);
  }
}