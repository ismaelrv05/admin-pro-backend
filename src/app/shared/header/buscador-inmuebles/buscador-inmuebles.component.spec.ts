import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorInmueblesComponent } from './buscador-inmuebles.component';

describe('BuscadorInmueblesComponent', () => {
  let component: BuscadorInmueblesComponent;
  let fixture: ComponentFixture<BuscadorInmueblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuscadorInmueblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorInmueblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
