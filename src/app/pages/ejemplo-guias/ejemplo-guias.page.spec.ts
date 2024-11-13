import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EjemploGuiasPage } from './ejemplo-guias.page';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SevicebdService } from 'src/app/services/sevicebd.service';

class SQLiteObjectMock {
  executeSql(query: string, params: any[]): Promise<any> {
    return Promise.resolve({
      rows: {
        length: 1,
        item: (index: number) => ({ id: 1, name: 'Test Item' })
      }
    });
  }
}

class SQLiteMock {
  create(): Promise<SQLiteObjectMock> {
    return Promise.resolve(new SQLiteObjectMock());
  }
}

class NativeStorageMock {
  getItem(key: string): Promise<any> {
    return Promise.resolve({});
  }

  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve();
  }
}

describe('EjemploGuiasPage', () => {
  let component: EjemploGuiasPage;
  let fixture: ComponentFixture<EjemploGuiasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EjemploGuiasPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (param: string) => 'test-value' }),
            snapshot: {
              paramMap: {
                get: (param: string) => 'test-value'
              }
            }
          }
        },
        { provide: SQLite, useClass: SQLiteMock },
        { provide: NativeStorage, useClass: NativeStorageMock },
        SevicebdService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EjemploGuiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
