import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTagComponent } from './text-tag.component';

describe('TextTagComponent', () => {
  let component: TextTagComponent;
  let fixture: ComponentFixture<TextTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
