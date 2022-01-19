import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HealthCareDependencyDeveryDetailComponent } from './health-care-dependency-devery-detail.component';

describe('HealthCareDependencyDevery Management Detail Component', () => {
  let comp: HealthCareDependencyDeveryDetailComponent;
  let fixture: ComponentFixture<HealthCareDependencyDeveryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HealthCareDependencyDeveryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ healthCareDependency: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HealthCareDependencyDeveryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HealthCareDependencyDeveryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load healthCareDependency on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.healthCareDependency).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
