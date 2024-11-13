import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OlvidePassPage } from './olvide-pass.page';
import { SevicebdService } from 'src/app/services/sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('OlvidePassPage', () => {
  let component: OlvidePassPage;
  let fixture: ComponentFixture<OlvidePassPage>;

  beforeEach(async () => {
    const sqliteSpy = jasmine.createSpyObj('SQLite', ['create']); // Mock para SQLite
    const nativeStorageSpy = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem']); // Mock para NativeStorage

    await TestBed.configureTestingModule({
      declarations: [OlvidePassPage],
      providers: [
        SevicebdService,
        { provide: SQLite, useValue: sqliteSpy },
        { provide: NativeStorage, useValue: nativeStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OlvidePassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
