import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EjemploPostPage } from './ejemplo-post.page';

describe('EjemploPostPage', () => {
  let component: EjemploPostPage;
  let fixture: ComponentFixture<EjemploPostPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EjemploPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
