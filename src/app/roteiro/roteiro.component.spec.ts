import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoteiroComponent } from './roteiro.component';

describe('RoteiroComponent', () => {
  let component: RoteiroComponent;
  let fixture: ComponentFixture<RoteiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoteiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoteiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
