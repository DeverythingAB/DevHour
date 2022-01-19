import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LocationDeveryComponent } from '../list/location-devery.component';
import { LocationDeveryDetailComponent } from '../detail/location-devery-detail.component';
import { LocationDeveryUpdateComponent } from '../update/location-devery-update.component';
import { LocationDeveryRoutingResolveService } from './location-devery-routing-resolve.service';

const locationRoute: Routes = [
  {
    path: '',
    component: LocationDeveryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LocationDeveryDetailComponent,
    resolve: {
      location: LocationDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocationDeveryUpdateComponent,
    resolve: {
      location: LocationDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LocationDeveryUpdateComponent,
    resolve: {
      location: LocationDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(locationRoute)],
  exports: [RouterModule],
})
export class LocationDeveryRoutingModule {}
