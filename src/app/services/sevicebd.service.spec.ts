import { TestBed } from '@angular/core/testing';

import { SevicebdService } from './sevicebd.service';

describe('SevicebdService', () => {
  let service: SevicebdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SevicebdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
