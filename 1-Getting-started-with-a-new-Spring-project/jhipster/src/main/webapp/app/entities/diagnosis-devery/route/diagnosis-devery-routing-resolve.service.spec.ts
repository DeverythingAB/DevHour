import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDiagnosisDevery, DiagnosisDevery } from '../diagnosis-devery.model';
import { DiagnosisDeveryService } from '../service/diagnosis-devery.service';

import { DiagnosisDeveryRoutingResolveService } from './diagnosis-devery-routing-resolve.service';

describe('DiagnosisDevery routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DiagnosisDeveryRoutingResolveService;
  let service: DiagnosisDeveryService;
  let resultDiagnosisDevery: IDiagnosisDevery | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(DiagnosisDeveryRoutingResolveService);
    service = TestBed.inject(DiagnosisDeveryService);
    resultDiagnosisDevery = undefined;
  });

  describe('resolve', () => {
    it('should return IDiagnosisDevery returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDiagnosisDevery = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDiagnosisDevery).toEqual({ id: 123 });
    });

    it('should return new IDiagnosisDevery if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDiagnosisDevery = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDiagnosisDevery).toEqual(new DiagnosisDevery());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as DiagnosisDevery })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDiagnosisDevery = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDiagnosisDevery).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
