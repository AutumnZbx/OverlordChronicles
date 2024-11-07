import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  notificaciones: any[] = [];
  usuario: any = {};

  constructor(
    private alertController: AlertController, 
    private bd: SevicebdService,
    private storage: NativeStorage,
    private router: Router, 
    private activedroute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  ionViewWillEnter() {
    this.cargarDatosUsuario(); // Asegura cargar datos cuando se entra a la vista
  }

  cargarDatosUsuario() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('Usuario guardado:', user);

      this.bd.dbReady().subscribe(data => {
        if (data) {
          this.bd.getUsuarioById(user.id_usuario).then(res => {
            this.usuario = res;
            if (this.usuario && this.usuario.id_usuario) {
              this.cargarNotificaciones(); // Cargar notificaciones solo después de obtener usuario
            }
          });
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  async cargarNotificaciones() {
    if (this.usuario && this.usuario.id_usuario) {
      try {
        const data = await this.bd.obtenerNotificaciones(this.usuario.id_usuario);
        this.notificaciones = Array.from(data);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    }
  }

  async marcarComoLeida(id_notificacion: number) {
    // Mark the notification as read in the database
    await this.bd.marcarComoLeida(id_notificacion);
    // Reload the notifications after marking as read
    this.cargarNotificaciones(); 
  }
  
  async marcarTodasComoLeidas() {
    if (this.usuario && this.usuario.id_usuario) {
      // Mark all notifications as read for the user
      await this.bd.marcarTodasComoLeidas(this.usuario.id_usuario);
      this.cargarNotificaciones(); // Reload after marking all as read
    }
  }
  
  async eliminarNotificacion(id_notificacion: number) {
    // Delete the notification from the database
    await this.bd.eliminarNotificacion(id_notificacion);
    // Reload notifications after deletion
    this.cargarNotificaciones();
  }
}
