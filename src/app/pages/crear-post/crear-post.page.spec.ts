import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearPostPage } from './crear-post.page';

describe('CrearPostPage', () => {
  let component: CrearPostPage;
  let fixture: ComponentFixture<CrearPostPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
