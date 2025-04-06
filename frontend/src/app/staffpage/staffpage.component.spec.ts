import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffpageComponent } from './staffpage.component';

describe('StaffpageComponent', () => {
  let component: StaffpageComponent;
  let fixture: ComponentFixture<StaffpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
