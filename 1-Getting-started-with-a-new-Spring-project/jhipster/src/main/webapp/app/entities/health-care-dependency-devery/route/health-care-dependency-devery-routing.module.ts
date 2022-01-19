import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HealthCareDependencyDeveryComponent } from '../list/health-care-dependency-devery.component';
import { HealthCareDependencyDeveryDetailComponent } from '../detail/health-care-dependency-devery-detail.component';
import { HealthCareDependencyDeveryUpdateComponent } from '../update/health-care-dependency-devery-update.component';
import { HealthCareDependencyDeveryRoutingResolveService } from './health-care-dependency-devery-routing-resolve.service';

const healthCareDependencyRoute: Routes = [
  {
    path: '',
    component: HealthCareDependencyDeveryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HealthCareDependencyDeveryDetailComponent,
    resolve: {
      healthCareDependency: HealthCareDependencyDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HealthCareDependencyDeveryUpdateComponent,
    resolve: {
      healthCareDependency: HealthCareDependencyDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HealthCareDependencyDeveryUpdateComponent,
    resolve: {
      healthCareDependency: HealthCareDependencyDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(healthCareDependencyRoute)],
  exports: [RouterModule],
})
export class HealthCareDependencyDeveryRoutingModule {}
