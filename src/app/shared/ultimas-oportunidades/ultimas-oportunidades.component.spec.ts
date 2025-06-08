import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimasOportunidadesComponent } from './ultimas-oportunidades.component';

describe('UltimasOportunidadesComponent', () => {
  let component: UltimasOportunidadesComponent;
  let fixture: ComponentFixture<UltimasOportunidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UltimasOportunidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimasOportunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
