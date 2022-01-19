import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHealthCareDependencyDevery, HealthCareDependencyDevery } from '../health-care-dependency-devery.model';

import { HealthCareDependencyDeveryService } from './health-care-dependency-devery.service';

describe('HealthCareDependencyDevery Service', () => {
  let service: HealthCareDependencyDeveryService;
  let httpMock: HttpTestingController;
  let elemDefault: IHealthCareDependencyDevery;
  let expectedResult: IHealthCareDependencyDevery | IHealthCareDependencyDevery[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HealthCareDependencyDeveryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
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

    it('should create a HealthCareDependencyDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new HealthCareDependencyDevery()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HealthCareDependencyDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HealthCareDependencyDevery', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new HealthCareDependencyDevery()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HealthCareDependencyDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should delete a HealthCareDependencyDevery', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHealthCareDependencyDeveryToCollectionIfMissing', () => {
      it('should add a HealthCareDependencyDevery to an empty array', () => {
        const healthCareDependency: IHealthCareDependencyDevery = { id: 123 };
        expectedResult = service.addHealthCareDependencyDeveryToCollectionIfMissing([], healthCareDependency);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(healthCareDependency);
      });

      it('should not add a HealthCareDependencyDevery to an array that contains it', () => {
        const healthCareDependency: IHealthCareDependencyDevery = { id: 123 };
        const healthCareDependencyCollection: IHealthCareDependencyDevery[] = [
          {
            ...healthCareDependency,
          },
          { id: 456 },
        ];
        expectedResult = service.addHealthCareDependencyDeveryToCollectionIfMissing(healthCareDependencyCollection, healthCareDependency);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HealthCareDependencyDevery to an array that doesn't contain it", () => {
        const healthCareDependency: IHealthCareDependencyDevery = { id: 123 };
        const healthCareDependencyCollection: IHealthCareDependencyDevery[] = [{ id: 456 }];
        expectedResult = service.addHealthCareDependencyDeveryToCollectionIfMissing(healthCareDependencyCollection, healthCareDependency);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(healthCareDependency);
      });

      it('should add only unique HealthCareDependencyDevery to an array', () => {
        const healthCareDependencyArray: IHealthCareDependencyDevery[] = [{ id: 123 }, { id: 456 }, { id: 25269 }];
        const healthCareDependencyCollection: IHealthCareDependencyDevery[] = [{ id: 123 }];
        expectedResult = service.addHealthCareDependencyDeveryToCollectionIfMissing(
          healthCareDependencyCollection,
          ...healthCareDependencyArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const healthCareDependency: IHealthCareDependencyDevery = { id: 123 };
        const healthCareDependency2: IHealthCareDependencyDevery = { id: 456 };
        expectedResult = service.addHealthCareDependencyDeveryToCollectionIfMissing([], healthCareDependency, healthCareDependency2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(healthCareDependency);
        expect(expectedResult).toContain(healthCareDependency2);
      });

      it('should accept null and undefined values', () => {
        const healthCareDependency: IHealthCareDependencyDevery = { id: 123 };
        expectedResult = service.addHealthCareDependencyDeveryToCollectionIfMissing([], null, healthCareDependency, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(healthCareDependency);
      });

      it('should return initial array if no HealthCareDependencyDevery is added', () => {
        const healthCareDependencyCollection: IHealthCareDependencyDevery[] = [{ id: 123 }];
        expectedResult = service.addHealthCareDependencyDeveryToCollectionIfMissing(healthCareDependencyCollection, undefined, null);
        expect(expectedResult).toEqual(healthCareDependencyCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
