import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjetosPage } from './objetos.page';

describe('ObjetosPage', () => {
  let component: ObjetosPage;
  let fixture: ComponentFixture<ObjetosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
