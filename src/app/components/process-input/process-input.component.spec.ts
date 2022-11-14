import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInputComponent } from './process-input.component';

describe('ProcessInputComponent', () => {
  let component: ProcessInputComponent;
  let fixture: ComponentFixture<ProcessInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
