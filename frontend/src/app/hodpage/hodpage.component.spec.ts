import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodpageComponent } from './hodpage.component';

describe('HodpageComponent', () => {
  let component: HodpageComponent;
  let fixture: ComponentFixture<HodpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HodpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HodpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
