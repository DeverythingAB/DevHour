import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PatientDeveryComponent } from '../list/patient-devery.component';
import { PatientDeveryDetailComponent } from '../detail/patient-devery-detail.component';
import { PatientDeveryUpdateComponent } from '../update/patient-devery-update.component';
import { PatientDeveryRoutingResolveService } from './patient-devery-routing-resolve.service';

const patientRoute: Routes = [
  {
    path: '',
    component: PatientDeveryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PatientDeveryDetailComponent,
    resolve: {
      patient: PatientDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PatientDeveryUpdateComponent,
    resolve: {
      patient: PatientDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PatientDeveryUpdateComponent,
    resolve: {
      patient: PatientDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(patientRoute)],
  exports: [RouterModule],
})
export class PatientDeveryRoutingModule {}
