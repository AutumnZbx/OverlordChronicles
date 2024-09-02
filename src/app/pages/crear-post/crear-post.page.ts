import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.page.html',
  styleUrls: ['./crear-post.page.scss'],
})
export class CrearPostPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  crear(){
    this.router.navigate(['/foro']);
  }

}
