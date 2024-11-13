import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForoPage } from './foro.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SevicebdService } from 'src/app/services/sevicebd.service';

describe('ForoPage', () => {
  let component: ForoPage;
  let fixture: ComponentFixture<ForoPage>;

  beforeEach(async () => {
    // Mock de SQLiteObject con el método executeSql
    const sqliteObjectMock = {
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0, item: (index: number) => null } }))
    };

    // Mock de SQLite para devolver SQLiteObject
    const sqliteMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve(sqliteObjectMock))
    };

    await TestBed.configureTestingModule({
      declarations: [ForoPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => 'mockedParam'
            }),
            snapshot: {
              paramMap: {
                get: (key: string) => 'mockedParam'
              }
            }
          }
        },
        {
          provide: SQLite, 
          useValue: sqliteMock
        },
        {
          provide: NativeStorage, 
          useValue: {  // Mock para NativeStorage
            getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('mockedValue')),
            setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve())
          }
        },
        SevicebdService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
