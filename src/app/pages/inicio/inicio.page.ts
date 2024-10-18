import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private router:Router, private storage: NativeStorage,
    private bd:SevicebdService) {
      LocalNotifications.requestPermissions();
     }

  async ngOnInit() {
    this.bd.dbReady();
    // Verificar si el usuario ya está logueado
    const storedUser = await localStorage.getItem('user');
    
    if (storedUser) {
      // Si está logueado, redirigir a la página principal
      this.router.navigate(['/home']);
    }
  }

  login(){
    this.router.navigate(['/login']);
  }
  registro(){
    this.router.navigate(['/registro']);
  }
}
