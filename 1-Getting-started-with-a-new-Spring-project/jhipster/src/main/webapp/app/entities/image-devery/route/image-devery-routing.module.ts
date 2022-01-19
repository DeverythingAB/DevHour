import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ImageDeveryComponent } from '../list/image-devery.component';
import { ImageDeveryDetailComponent } from '../detail/image-devery-detail.component';
import { ImageDeveryUpdateComponent } from '../update/image-devery-update.component';
import { ImageDeveryRoutingResolveService } from './image-devery-routing-resolve.service';

const imageRoute: Routes = [
  {
    path: '',
    component: ImageDeveryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ImageDeveryDetailComponent,
    resolve: {
      image: ImageDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ImageDeveryUpdateComponent,
    resolve: {
      image: ImageDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ImageDeveryUpdateComponent,
    resolve: {
      image: ImageDeveryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(imageRoute)],
  exports: [RouterModule],
})
export class ImageDeveryRoutingModule {}
