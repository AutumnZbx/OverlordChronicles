import { Component } from '@angular/core';
import { NavigationExtras,Router,ActivatedRoute } from '@angular/router';
import { SevicebdService } from '../services/sevicebd.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  latestPosts: any[] = [];
  latestGuides: any[] = [];


  usuario: string ="";


  constructor(private router: Router, private activedroute: ActivatedRoute, private bd:SevicebdService) { 
    this.loadLatestContent();
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

  goToPost(post: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        postseleccionado: post
      }
    }
    this.router.navigate(['/postejemplo'], navigationExtras)
  }

  goToGuide(guide: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        postseleccionado: guide
      }
    }
    this.router.navigate(['/ejemplo-guias'], navigationExtras)
  }
 
  
   

  


}
