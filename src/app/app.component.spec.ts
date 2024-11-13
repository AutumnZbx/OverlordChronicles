import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { SevicebdService } from './services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        SevicebdService,
        SQLite,
        NativeStorage,
        { 
          provide: ActivatedRoute, 
          useValue: {
            params: of({}),  // Puedes simular los parámetros de la ruta
            snapshot: { paramMap: { get: () => null } }
          } 
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
