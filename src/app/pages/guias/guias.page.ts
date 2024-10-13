import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.page.html',
  styleUrls: ['./guias.page.scss'],
})
export class GuiasPage implements OnInit {

  guias: any[] = [];

  constructor(private router: Router, private activedroute: ActivatedRoute, private bd:SevicebdService,private storage: NativeStorage, private alertCtrl: AlertController) { 
    
   }
    ngOnInit() {
      this.loadGuides();
    }

    loadGuides() {
      this.bd.getAllGuides().then(result => {
        this.guias = [];
        for (let i = 0; i < result.rows.length; i++) {
          this.guias.push(result.rows.item(i));
        }
      });
    }
  
    // Navigate to the Create Post page
    createGuide() {
      this.router.navigate(['/crear-guia']);
    }

    goToGuide(guia: any) {
      const navigationExtras = {
        state: {
          guiaId: guia.id_guia 
        }
      };
      this.router.navigate(['/ejemplo-guias'], navigationExtras);
    }

    async deleteGuide(id_guias: number) {
      console.log('ID de la guía a eliminar:', id_guias);
      const alert = await this.alertCtrl.create({
        header: 'Confirm Delete',
        message: 'Are you sure you want to delete this guide?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Delete',
            handler: () => {
              this.bd.deleteGuide(id_guias).then(() => {
                console.log('Guía eliminada con éxito');
                this.loadGuides(); // Recargar la lista de guías después de eliminar
              }).catch((err) => {
                console.error('Error al eliminar la guía:', err);
              });
            },
          },
        ],
      });
    
      await alert.present();
    }
  
    

}


