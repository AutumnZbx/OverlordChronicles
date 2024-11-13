import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioPage } from './inicio.page';
import { IonicModule } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioPage],
      imports: [IonicModule.forRoot()],
      providers: [SevicebdService, SQLite, NativeStorage] // Coloca NativeStorage en providers en vez de imports
    }).compileComponents();
    
    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
