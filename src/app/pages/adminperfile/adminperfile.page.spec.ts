import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminperfilePage } from './adminperfile.page';
import { IonicModule } from '@ionic/angular';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AdminperfilePage', () => {
  let component: AdminperfilePage;
  let fixture: ComponentFixture<AdminperfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminperfilePage],
      imports: [IonicModule.forRoot()],
      providers: [
        SevicebdService,
        SQLite,
        { 
          provide: ActivatedRoute, 
          useValue: {
            params: of({}), // Simula parámetros de ruta como un observable vacío
            snapshot: { paramMap: { get: () => null } } // Simula un paramMap vacío
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminperfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
