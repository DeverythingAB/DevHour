import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReceiptDeveryComponent } from '../list/receipt-devery.component';
import { ReceiptDeveryDetailComponent } from '../detail/receipt-devery-detail.component';
import { ReceiptDeveryUpdateComponent } from '../update/receipt-devery-update.component';
import { ReceiptDeveryRoutingResolveService } from './receipt-devery-routing-resolve.service';

const receiptRoute: Routes = [
  {
    path: '',
    component: ReceiptDeveryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReceiptDeveryDetailComponent,
    resolve: {
      receipt: ReceiptDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReceiptDeveryUpdateComponent,
    resolve: {
      receipt: ReceiptDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReceiptDeveryUpdateComponent,
    resolve: {
      receipt: ReceiptDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(receiptRoute)],
  exports: [RouterModule],
})
export class ReceiptDeveryRoutingModule {}
