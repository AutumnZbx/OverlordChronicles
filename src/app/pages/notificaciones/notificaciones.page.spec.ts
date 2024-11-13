import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesPage } from './notificaciones.page';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NotificacionesPage', () => {
  let component: NotificacionesPage;
  let fixture: ComponentFixture<NotificacionesPage>;

  beforeEach(async () => {
    const sqliteSpy = jasmine.createSpyObj('SQLite', ['create']);
    const nativeStorageSpy = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem']);
    
    await TestBed.configureTestingModule({
      declarations: [NotificacionesPage],
      providers: [
        { provide: SQLite, useValue: sqliteSpy },
        { provide: NativeStorage, useValue: nativeStorageSpy },
        SevicebdService,
        { 
          provide: ActivatedRoute, 
          useValue: { params: of({}) } // Proveedor mock para ActivatedRoute
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
