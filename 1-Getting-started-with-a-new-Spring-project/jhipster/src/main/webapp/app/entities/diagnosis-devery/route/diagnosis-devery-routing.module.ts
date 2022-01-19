import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DiagnosisDeveryComponent } from '../list/diagnosis-devery.component';
import { DiagnosisDeveryDetailComponent } from '../detail/diagnosis-devery-detail.component';
import { DiagnosisDeveryUpdateComponent } from '../update/diagnosis-devery-update.component';
import { DiagnosisDeveryRoutingResolveService } from './diagnosis-devery-routing-resolve.service';

const diagnosisRoute: Routes = [
  {
    path: '',
    component: DiagnosisDeveryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiagnosisDeveryDetailComponent,
    resolve: {
      diagnosis: DiagnosisDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiagnosisDeveryUpdateComponent,
    resolve: {
      diagnosis: DiagnosisDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiagnosisDeveryUpdateComponent,
    resolve: {
      diagnosis: DiagnosisDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(diagnosisRoute)],
  exports: [RouterModule],
})
export class DiagnosisDeveryRoutingModule {}
