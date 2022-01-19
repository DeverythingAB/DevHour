import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LocationDeveryComponent } from './list/location-devery.component';
import { LocationDeveryDetailComponent } from './detail/location-devery-detail.component';
import { LocationDeveryUpdateComponent } from './update/location-devery-update.component';
import { LocationDeveryDeleteDialogComponent } from './delete/location-devery-delete-dialog.component';
import { LocationDeveryRoutingModule } from './route/location-devery-routing.module';

@NgModule({
  imports: [SharedModule, LocationDeveryRoutingModule],
  declarations: [
    LocationDeveryComponent,
    LocationDeveryDetailComponent,
    LocationDeveryUpdateComponent,
    LocationDeveryDeleteDialogComponent,
  ],
  entryComponents: [LocationDeveryDeleteDialogComponent],
})
export class LocationDeveryModule {}
