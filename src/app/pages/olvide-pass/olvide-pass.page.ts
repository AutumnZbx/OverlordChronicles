import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

@Component({
  selector: 'app-olvide-pass',
  templateUrl: './olvide-pass.page.html',
  styleUrls: ['./olvide-pass.page.scss'],
})
export class OlvidePassPage implements OnInit {

  email: string = '';
  codigo: string = '';
  nuevaContrasena: string = '';
  codigoEnviado: boolean = false;
  codigoVerificado: boolean = false;
  codigoGenerado: string = '';

  constructor(private router:Router, private alertController: AlertController,private toastController: ToastController,private bd : SevicebdService) { }

  ngOnInit() {
  }
  
   // Enviar el código de recuperación al correo y activar la notificación local
   async enviarCodigo() {
    if (this.email.trim()) {
      const usuarioExiste = await this.verificarCorreo(this.email); // Verificar si el correo existe en la BD
      
      if (usuarioExiste) {
        this.codigoGenerado = this.generarCodigo(); // Generar un código aleatorio
        this.codigoEnviado = true;

        // Mostrar notificación local cuando se envía el código
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 1,
              title: "Password Recovery",
              body: "Your password recovery code",
              largeBody: "Enter the following code: " +this.codigoGenerado,
              schedule: { at: new Date(new Date().getTime() + 1000) }, // Notificación en 1 segundo
            },
          ],
        });

        this.mostrarToast('Recovery code sent');
      } else {
        this.mostrarToast('The email address is not registered');
      }
    } else {
      this.mostrarToast('Please enter your email address');
    }
  }

  // Verificar si el código ingresado es correcto
  verificarCodigo() {
    if (this.codigo === this.codigoGenerado) {
      this.codigoVerificado = true;
      this.mostrarToast('Code verified successfully');
    } else {
      this.mostrarToast('The entered code is incorrect');
    }
  }

  // Restablecer la contraseña
  async restablecerContrasena() {
    if (this.nuevaContrasena.trim()) {
      try {
        await this.bd.actualizarContrasena(this.email, this.nuevaContrasena); // Actualizar la contraseña en la base de datos
        this.mostrarToast('Password reset successfully');
        this.router.navigate(['/login']);
      } catch (error) {
        this.mostrarToast('Error resetting the password');
        console.error('Error resetting password', error);
      }
    } else {
      this.mostrarToast('Please enter a new password');
    }
  }

  // Método para verificar si el correo electrónico existe en la base de datos
  async verificarCorreo(email: string): Promise<boolean> {
    try {
      const usuario = await this.bd.getUsuarioByEmail(email); // Supongamos que tienes un método en tu servicio de base de datos
      return !!usuario; // Devuelve true si el usuario existe
    } catch (error) {
      console.error('Error al verificar el correo', error);
      return false;
    }
  }

  // Generar un código aleatorio de 6 dígitos
  generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Mostrar toast para mensajes de retroalimentación
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}

