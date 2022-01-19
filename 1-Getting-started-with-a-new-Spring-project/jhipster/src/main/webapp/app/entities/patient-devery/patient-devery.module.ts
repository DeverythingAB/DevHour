import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PatientDeveryComponent } from './list/patient-devery.component';
import { PatientDeveryDetailComponent } from './detail/patient-devery-detail.component';
import { PatientDeveryUpdateComponent } from './update/patient-devery-update.component';
import { PatientDeveryDeleteDialogComponent } from './delete/patient-devery-delete-dialog.component';
import { PatientDeveryRoutingModule } from './route/patient-devery-routing.module';

@NgModule({
  imports: [SharedModule, PatientDeveryRoutingModule],
  declarations: [PatientDeveryComponent, PatientDeveryDetailComponent, PatientDeveryUpdateComponent, PatientDeveryDeleteDialogComponent],
  entryComponents: [PatientDeveryDeleteDialogComponent],
})
export class PatientDeveryModule {}
