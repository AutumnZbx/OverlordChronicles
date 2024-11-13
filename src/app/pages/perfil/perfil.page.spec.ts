import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(async () => {
    // Crear mocks para SQLite y NativeStorage
    const sqliteSpy = jasmine.createSpyObj('SQLite', ['create']);
    const nativeStorageSpy = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem']);

    await TestBed.configureTestingModule({
      declarations: [PerfilPage],
      providers: [
        SevicebdService,
        { provide: SQLite, useValue: sqliteSpy },
        { provide: NativeStorage, useValue: nativeStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
