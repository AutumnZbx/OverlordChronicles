import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostejemploPage } from './postejemplo.page';

describe('PostejemploPage', () => {
  let component: PostejemploPage;
  let fixture: ComponentFixture<PostejemploPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostejemploPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
