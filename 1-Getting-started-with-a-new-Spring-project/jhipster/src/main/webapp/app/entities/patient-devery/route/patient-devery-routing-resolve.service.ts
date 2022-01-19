import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPatientDevery, PatientDevery } from '../patient-devery.model';
import { PatientDeveryService } from '../service/patient-devery.service';

@Injectable({ providedIn: 'root' })
export class PatientDeveryRoutingResolveService implements Resolve<IPatientDevery> {
  constructor(protected service: PatientDeveryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPatientDevery> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((patient: HttpResponse<PatientDevery>) => {
          if (patient.body) {
            return of(patient.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PatientDevery());
  }
}
