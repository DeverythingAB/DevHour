import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDiagnosisDevery, DiagnosisDevery } from '../diagnosis-devery.model';

import { DiagnosisDeveryService } from './diagnosis-devery.service';

describe('DiagnosisDevery Service', () => {
  let service: DiagnosisDeveryService;
  let httpMock: HttpTestingController;
  let elemDefault: IDiagnosisDevery;
  let expectedResult: IDiagnosisDevery | IDiagnosisDevery[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DiagnosisDeveryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      diagnosis: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a DiagnosisDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new DiagnosisDevery()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DiagnosisDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          diagnosis: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DiagnosisDevery', () => {
      const patchObject = Object.assign(
        {
          diagnosis: 'BBBBBB',
        },
        new DiagnosisDevery()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DiagnosisDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          diagnosis: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a DiagnosisDevery', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDiagnosisDeveryToCollectionIfMissing', () => {
      it('should add a DiagnosisDevery to an empty array', () => {
        const diagnosis: IDiagnosisDevery = { id: 123 };
        expectedResult = service.addDiagnosisDeveryToCollectionIfMissing([], diagnosis);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(diagnosis);
      });

      it('should not add a DiagnosisDevery to an array that contains it', () => {
        const diagnosis: IDiagnosisDevery = { id: 123 };
        const diagnosisCollection: IDiagnosisDevery[] = [
          {
            ...diagnosis,
          },
          { id: 456 },
        ];
        expectedResult = service.addDiagnosisDeveryToCollectionIfMissing(diagnosisCollection, diagnosis);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DiagnosisDevery to an array that doesn't contain it", () => {
        const diagnosis: IDiagnosisDevery = { id: 123 };
        const diagnosisCollection: IDiagnosisDevery[] = [{ id: 456 }];
        expectedResult = service.addDiagnosisDeveryToCollectionIfMissing(diagnosisCollection, diagnosis);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(diagnosis);
      });

      it('should add only unique DiagnosisDevery to an array', () => {
        const diagnosisArray: IDiagnosisDevery[] = [{ id: 123 }, { id: 456 }, { id: 32184 }];
        const diagnosisCollection: IDiagnosisDevery[] = [{ id: 123 }];
        expectedResult = service.addDiagnosisDeveryToCollectionIfMissing(diagnosisCollection, ...diagnosisArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const diagnosis: IDiagnosisDevery = { id: 123 };
        const diagnosis2: IDiagnosisDevery = { id: 456 };
        expectedResult = service.addDiagnosisDeveryToCollectionIfMissing([], diagnosis, diagnosis2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(diagnosis);
        expect(expectedResult).toContain(diagnosis2);
      });

      it('should accept null and undefined values', () => {
        const diagnosis: IDiagnosisDevery = { id: 123 };
        expectedResult = service.addDiagnosisDeveryToCollectionIfMissing([], null, diagnosis, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(diagnosis);
      });

      it('should return initial array if no DiagnosisDevery is added', () => {
        const diagnosisCollection: IDiagnosisDevery[] = [{ id: 123 }];
        expectedResult = service.addDiagnosisDeveryToCollectionIfMissing(diagnosisCollection, undefined, null);
        expect(expectedResult).toEqual(diagnosisCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
