import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OlvidePassPage } from './olvide-pass.page';

describe('OlvidePassPage', () => {
  let component: OlvidePassPage;
  let fixture: ComponentFixture<OlvidePassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvidePassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
