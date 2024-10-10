import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router,ActivatedRoute } from '@angular/router';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.page.html',
  styleUrls: ['./guias.page.scss'],
})
export class GuiasPage implements OnInit {

  guias: any[] = [];

  constructor(private router: Router, private activedroute: ActivatedRoute, private bd:SevicebdService) { 
    
   }
    ngOnInit() {
      this.loadGuides();
    }
    crear(){
      this.router.navigate(['/crear-guia']);
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

    goToGuide(guias: any) {
      this.router.navigate(['/ejemplo-guias', guias]);
    }
  
    

}


