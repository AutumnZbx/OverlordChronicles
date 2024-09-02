import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModpersonajesPage } from './modpersonajes.page';

describe('ModpersonajesPage', () => {
  let component: ModpersonajesPage;
  let fixture: ComponentFixture<ModpersonajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModpersonajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
