import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReceiptDevery, ReceiptDevery } from '../receipt-devery.model';
import { ReceiptDeveryService } from '../service/receipt-devery.service';

@Injectable({ providedIn: 'root' })
export class ReceiptDeveryRoutingResolveService implements Resolve<IReceiptDevery> {
  constructor(protected service: ReceiptDeveryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReceiptDevery> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((receipt: HttpResponse<ReceiptDevery>) => {
          if (receipt.body) {
            return of(receipt.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ReceiptDevery());
  }
}
