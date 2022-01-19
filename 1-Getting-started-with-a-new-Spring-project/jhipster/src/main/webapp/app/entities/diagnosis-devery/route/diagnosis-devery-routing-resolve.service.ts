import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDiagnosisDevery, DiagnosisDevery } from '../diagnosis-devery.model';
import { DiagnosisDeveryService } from '../service/diagnosis-devery.service';

@Injectable({ providedIn: 'root' })
export class DiagnosisDeveryRoutingResolveService implements Resolve<IDiagnosisDevery> {
  constructor(protected service: DiagnosisDeveryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDiagnosisDevery> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((diagnosis: HttpResponse<DiagnosisDevery>) => {
          if (diagnosis.body) {
            return of(diagnosis.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DiagnosisDevery());
  }
}
