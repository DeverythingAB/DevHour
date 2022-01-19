import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HealthCareDependencyDeveryService } from '../service/health-care-dependency-devery.service';
import { IHealthCareDependencyDevery, HealthCareDependencyDevery } from '../health-care-dependency-devery.model';
import { ILocationDevery } from 'app/entities/location-devery/location-devery.model';
import { LocationDeveryService } from 'app/entities/location-devery/service/location-devery.service';

import { HealthCareDependencyDeveryUpdateComponent } from './health-care-dependency-devery-update.component';

describe('HealthCareDependencyDevery Management Update Component', () => {
  let comp: HealthCareDependencyDeveryUpdateComponent;
  let fixture: ComponentFixture<HealthCareDependencyDeveryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let healthCareDependencyService: HealthCareDependencyDeveryService;
  let locationService: LocationDeveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HealthCareDependencyDeveryUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(HealthCareDependencyDeveryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HealthCareDependencyDeveryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    healthCareDependencyService = TestBed.inject(HealthCareDependencyDeveryService);
    locationService = TestBed.inject(LocationDeveryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call location query and add missing value', () => {
      const healthCareDependency: IHealthCareDependencyDevery = { id: 456 };
      const location: ILocationDevery = { id: 13670 };
      healthCareDependency.location = location;

      const locationCollection: ILocationDevery[] = [{ id: 10944 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: ILocationDevery[] = [location, ...locationCollection];
      jest.spyOn(locationService, 'addLocationDeveryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ healthCareDependency });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationDeveryToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const healthCareDependency: IHealthCareDependencyDevery = { id: 456 };
      const location: ILocationDevery = { id: 43751 };
      healthCareDependency.location = location;

      activatedRoute.data = of({ healthCareDependency });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(healthCareDependency));
      expect(comp.locationsCollection).toContain(location);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HealthCareDependencyDevery>>();
      const healthCareDependency = { id: 123 };
      jest.spyOn(healthCareDependencyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ healthCareDependency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: healthCareDependency }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(healthCareDependencyService.update).toHaveBeenCalledWith(healthCareDependency);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HealthCareDependencyDevery>>();
      const healthCareDependency = new HealthCareDependencyDevery();
      jest.spyOn(healthCareDependencyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ healthCareDependency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: healthCareDependency }));
      saveSubject.complete();

      // THEN
      expect(healthCareDependencyService.create).toHaveBeenCalledWith(healthCareDependency);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HealthCareDependencyDevery>>();
      const healthCareDependency = { id: 123 };
      jest.spyOn(healthCareDependencyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ healthCareDependency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(healthCareDependencyService.update).toHaveBeenCalledWith(healthCareDependency);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLocationDeveryById', () => {
      it('Should return tracked LocationDevery primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLocationDeveryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
