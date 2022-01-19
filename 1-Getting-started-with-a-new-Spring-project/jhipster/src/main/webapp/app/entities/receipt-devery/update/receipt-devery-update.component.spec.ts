import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReceiptDeveryService } from '../service/receipt-devery.service';
import { IReceiptDevery, ReceiptDevery } from '../receipt-devery.model';
import { IHealthCareDependencyDevery } from 'app/entities/health-care-dependency-devery/health-care-dependency-devery.model';
import { HealthCareDependencyDeveryService } from 'app/entities/health-care-dependency-devery/service/health-care-dependency-devery.service';
import { IDiagnosisDevery } from 'app/entities/diagnosis-devery/diagnosis-devery.model';
import { DiagnosisDeveryService } from 'app/entities/diagnosis-devery/service/diagnosis-devery.service';

import { ReceiptDeveryUpdateComponent } from './receipt-devery-update.component';

describe('ReceiptDevery Management Update Component', () => {
  let comp: ReceiptDeveryUpdateComponent;
  let fixture: ComponentFixture<ReceiptDeveryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let receiptService: ReceiptDeveryService;
  let healthCareDependencyService: HealthCareDependencyDeveryService;
  let diagnosisService: DiagnosisDeveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReceiptDeveryUpdateComponent],
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
      .overrideTemplate(ReceiptDeveryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReceiptDeveryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    receiptService = TestBed.inject(ReceiptDeveryService);
    healthCareDependencyService = TestBed.inject(HealthCareDependencyDeveryService);
    diagnosisService = TestBed.inject(DiagnosisDeveryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call healthCareDependency query and add missing value', () => {
      const receipt: IReceiptDevery = { id: 456 };
      const healthCareDependency: IHealthCareDependencyDevery = { id: 89262 };
      receipt.healthCareDependency = healthCareDependency;

      const healthCareDependencyCollection: IHealthCareDependencyDevery[] = [{ id: 58426 }];
      jest.spyOn(healthCareDependencyService, 'query').mockReturnValue(of(new HttpResponse({ body: healthCareDependencyCollection })));
      const expectedCollection: IHealthCareDependencyDevery[] = [healthCareDependency, ...healthCareDependencyCollection];
      jest.spyOn(healthCareDependencyService, 'addHealthCareDependencyDeveryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      expect(healthCareDependencyService.query).toHaveBeenCalled();
      expect(healthCareDependencyService.addHealthCareDependencyDeveryToCollectionIfMissing).toHaveBeenCalledWith(
        healthCareDependencyCollection,
        healthCareDependency
      );
      expect(comp.healthCareDependenciesCollection).toEqual(expectedCollection);
    });

    it('Should call diagnosis query and add missing value', () => {
      const receipt: IReceiptDevery = { id: 456 };
      const diagnosis: IDiagnosisDevery = { id: 10326 };
      receipt.diagnosis = diagnosis;

      const diagnosisCollection: IDiagnosisDevery[] = [{ id: 88152 }];
      jest.spyOn(diagnosisService, 'query').mockReturnValue(of(new HttpResponse({ body: diagnosisCollection })));
      const expectedCollection: IDiagnosisDevery[] = [diagnosis, ...diagnosisCollection];
      jest.spyOn(diagnosisService, 'addDiagnosisDeveryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      expect(diagnosisService.query).toHaveBeenCalled();
      expect(diagnosisService.addDiagnosisDeveryToCollectionIfMissing).toHaveBeenCalledWith(diagnosisCollection, diagnosis);
      expect(comp.diagnosesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const receipt: IReceiptDevery = { id: 456 };
      const healthCareDependency: IHealthCareDependencyDevery = { id: 70313 };
      receipt.healthCareDependency = healthCareDependency;
      const diagnosis: IDiagnosisDevery = { id: 27549 };
      receipt.diagnosis = diagnosis;

      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(receipt));
      expect(comp.healthCareDependenciesCollection).toContain(healthCareDependency);
      expect(comp.diagnosesCollection).toContain(diagnosis);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ReceiptDevery>>();
      const receipt = { id: 123 };
      jest.spyOn(receiptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: receipt }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(receiptService.update).toHaveBeenCalledWith(receipt);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ReceiptDevery>>();
      const receipt = new ReceiptDevery();
      jest.spyOn(receiptService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: receipt }));
      saveSubject.complete();

      // THEN
      expect(receiptService.create).toHaveBeenCalledWith(receipt);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ReceiptDevery>>();
      const receipt = { id: 123 };
      jest.spyOn(receiptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(receiptService.update).toHaveBeenCalledWith(receipt);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackHealthCareDependencyDeveryById', () => {
      it('Should return tracked HealthCareDependencyDevery primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackHealthCareDependencyDeveryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDiagnosisDeveryById', () => {
      it('Should return tracked DiagnosisDevery primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDiagnosisDeveryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
