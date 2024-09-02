import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminperfile',
  templateUrl: './adminperfile.page.html',
  styleUrls: ['./adminperfile.page.scss'],
})
export class AdminperfilePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  perfil(){
    this.router.navigate(['/perfil']);
  }

}
