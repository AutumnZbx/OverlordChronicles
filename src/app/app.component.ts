import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  VerMenu = true;
  constructor(private router: Router) {
    this.router.events.subscribe((event) =>{
      if(event instanceof NavigationEnd) {
        this.updateMenuVisibility(event.url)
      }
    });
  }

  updateMenuVisibility(url: string){
    const hiddenRoutes = ['/login', '/register', '/cambiarcontra'];
    this.VerMenu = !hiddenRoutes.includes(url);
  }
}
