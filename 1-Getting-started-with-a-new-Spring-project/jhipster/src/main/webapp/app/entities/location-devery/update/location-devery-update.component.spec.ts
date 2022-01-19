import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LocationDeveryService } from '../service/location-devery.service';
import { ILocationDevery, LocationDevery } from '../location-devery.model';

import { LocationDeveryUpdateComponent } from './location-devery-update.component';

describe('LocationDevery Management Update Component', () => {
  let comp: LocationDeveryUpdateComponent;
  let fixture: ComponentFixture<LocationDeveryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let locationService: LocationDeveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LocationDeveryUpdateComponent],
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
      .overrideTemplate(LocationDeveryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LocationDeveryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    locationService = TestBed.inject(LocationDeveryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const location: ILocationDevery = { id: 456 };

      activatedRoute.data = of({ location });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(location));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LocationDevery>>();
      const location = { id: 123 };
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(locationService.update).toHaveBeenCalledWith(location);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LocationDevery>>();
      const location = new LocationDevery();
      jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationService.create).toHaveBeenCalledWith(location);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LocationDevery>>();
      const location = { id: 123 };
      jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(locationService.update).toHaveBeenCalledWith(location);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
