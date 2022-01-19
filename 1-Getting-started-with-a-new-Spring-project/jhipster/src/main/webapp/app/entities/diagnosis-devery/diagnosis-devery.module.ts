import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DiagnosisDeveryComponent } from './list/diagnosis-devery.component';
import { DiagnosisDeveryDetailComponent } from './detail/diagnosis-devery-detail.component';
import { DiagnosisDeveryUpdateComponent } from './update/diagnosis-devery-update.component';
import { DiagnosisDeveryDeleteDialogComponent } from './delete/diagnosis-devery-delete-dialog.component';
import { DiagnosisDeveryRoutingModule } from './route/diagnosis-devery-routing.module';

@NgModule({
  imports: [SharedModule, DiagnosisDeveryRoutingModule],
  declarations: [
    DiagnosisDeveryComponent,
    DiagnosisDeveryDetailComponent,
    DiagnosisDeveryUpdateComponent,
    DiagnosisDeveryDeleteDialogComponent,
  ],
  entryComponents: [DiagnosisDeveryDeleteDialogComponent],
})
export class DiagnosisDeveryModule {}
