import { TestBed } from '@angular/core/testing';
import { SevicebdService } from './sevicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite

describe('SevicebdService', () => {
  let service: SevicebdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SQLite], // Agrega SQLite como proveedor aquí
    });
    service = TestBed.inject(SevicebdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
