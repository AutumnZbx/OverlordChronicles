import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SevicebdService } from 'src/app/services/sevicebd.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private router:Router, private storage: NativeStorage,
    private bd:SevicebdService) { }

  ngOnInit() {
    this.bd.dbReady();
  }

  login(){
    this.router.navigate(['/login']);
  }
  registro(){
    this.router.navigate(['/registro']);
  }
}
