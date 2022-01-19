import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReceiptDevery, ReceiptDevery } from '../receipt-devery.model';

import { ReceiptDeveryService } from './receipt-devery.service';

describe('ReceiptDevery Service', () => {
  let service: ReceiptDeveryService;
  let httpMock: HttpTestingController;
  let elemDefault: IReceiptDevery;
  let expectedResult: IReceiptDevery | IReceiptDevery[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReceiptDeveryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      number: 0,
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

    it('should create a ReceiptDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ReceiptDevery()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ReceiptDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          number: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ReceiptDevery', () => {
      const patchObject = Object.assign({}, new ReceiptDevery());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ReceiptDevery', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          number: 1,
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

    it('should delete a ReceiptDevery', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addReceiptDeveryToCollectionIfMissing', () => {
      it('should add a ReceiptDevery to an empty array', () => {
        const receipt: IReceiptDevery = { id: 123 };
        expectedResult = service.addReceiptDeveryToCollectionIfMissing([], receipt);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(receipt);
      });

      it('should not add a ReceiptDevery to an array that contains it', () => {
        const receipt: IReceiptDevery = { id: 123 };
        const receiptCollection: IReceiptDevery[] = [
          {
            ...receipt,
          },
          { id: 456 },
        ];
        expectedResult = service.addReceiptDeveryToCollectionIfMissing(receiptCollection, receipt);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ReceiptDevery to an array that doesn't contain it", () => {
        const receipt: IReceiptDevery = { id: 123 };
        const receiptCollection: IReceiptDevery[] = [{ id: 456 }];
        expectedResult = service.addReceiptDeveryToCollectionIfMissing(receiptCollection, receipt);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(receipt);
      });

      it('should add only unique ReceiptDevery to an array', () => {
        const receiptArray: IReceiptDevery[] = [{ id: 123 }, { id: 456 }, { id: 99367 }];
        const receiptCollection: IReceiptDevery[] = [{ id: 123 }];
        expectedResult = service.addReceiptDeveryToCollectionIfMissing(receiptCollection, ...receiptArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const receipt: IReceiptDevery = { id: 123 };
        const receipt2: IReceiptDevery = { id: 456 };
        expectedResult = service.addReceiptDeveryToCollectionIfMissing([], receipt, receipt2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(receipt);
        expect(expectedResult).toContain(receipt2);
      });

      it('should accept null and undefined values', () => {
        const receipt: IReceiptDevery = { id: 123 };
        expectedResult = service.addReceiptDeveryToCollectionIfMissing([], null, receipt, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(receipt);
      });

      it('should return initial array if no ReceiptDevery is added', () => {
        const receiptCollection: IReceiptDevery[] = [{ id: 123 }];
        expectedResult = service.addReceiptDeveryToCollectionIfMissing(receiptCollection, undefined, null);
        expect(expectedResult).toEqual(receiptCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
