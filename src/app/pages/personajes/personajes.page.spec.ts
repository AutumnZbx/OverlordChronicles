import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonajesPage } from './personajes.page';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('PersonajesPage', () => {
  let component: PersonajesPage;
  let fixture: ComponentFixture<PersonajesPage>;

  beforeEach(async () => {
    const sqliteSpy = jasmine.createSpyObj('SQLite', ['create']);
    const nativeStorageSpy = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem']);

    await TestBed.configureTestingModule({
      declarations: [PersonajesPage],
      imports: [HttpClientModule],  // Importar HttpClientModule para que HttpClient esté disponible
      providers: [ApiService,
        SevicebdService,
        { provide: SQLite, useValue: sqliteSpy },
        { provide: NativeStorage, useValue: nativeStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
